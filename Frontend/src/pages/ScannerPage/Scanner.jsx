import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import faceidIcon from "../../assets/faceid.png";
import "./index.css";
import Spinner from "react-bootstrap/Spinner";

const SuccessCheck = () => (
  <div className="iconContainer">
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="54" fill="none" stroke="#0D1B3E" strokeWidth="4" />
      <polyline
        points="40,65 55,80 80,50"
        fill="none"
        stroke="#19C99A"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const RedCross = () => (
  <div className="iconContainer">
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="54" fill="none" stroke="#B00020" strokeWidth="4" />
      <line x1="40" y1="40" x2="80" y2="80" stroke="#B00020" strokeWidth="8" strokeLinecap="round" />
      <line x1="80" y1="40" x2="40" y2="80" stroke="#B00020" strokeWidth="8" strokeLinecap="round" />
    </svg>
  </div>
);

const Scanner = () => {
  const videoRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const intervalRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [labeledDescriptor, setLabeledDescriptor] = useState(null);
  const [dateString, setDateString] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [alreadyPresent, setAlreadyPresent] = useState(false);

  // -------- Helpers: arrêt propre de la webcam + interval + canvas
  const stopWebcam = () => {
    // Stoppe l'interval d’inférence
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const video = videoRef.current;
    if (!video) return;

    // Stoppe tous les tracks si encore actifs
    const stream = video.srcObject;
    if (stream && typeof stream.getTracks === "function") {
      stream.getTracks().forEach((t) => {
        try { t.stop(); } catch (_) {}
      });
    }

    // Libère la ressource côté <video>
    try { video.pause(); } catch (_) {}
    video.srcObject = null;
    video.removeAttribute("src");
    try { video.load(); } catch (_) {}

    // Nettoie le canvas d’overlay
    if (canvasContainerRef.current) {
      canvasContainerRef.current.innerHTML = "";
    }
  };

  // -------- Mount: lire userId, date
  useEffect(() => {
    const uid = localStorage.getItem("userId");
    setUserId(uid || null);
    const today = new Date().toLocaleDateString("fr-FR");
    setDateString(today);
  }, []);

  // -------- Guard + init: charger modèles, image ref, vérifier présence
  useEffect(() => {
    if (!userId || alreadyPresent) return;

    const init = async () => {
      await loadModels();
      await loadReferenceImage(userId);
      await checkPresenceOnServer(userId);
    };

    init();

    // Cleanup on unmount
    return () => {
      stopWebcam();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, alreadyPresent]);

  // -------- Sécurité: on coupe à la fermeture/onglet caché
  useEffect(() => {
    const onVis = () => { if (document.hidden) stopWebcam(); };
    window.addEventListener("beforeunload", stopWebcam);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("beforeunload", stopWebcam);
      document.removeEventListener("visibilitychange", onVis);
      stopWebcam();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------- Models
  const loadModels = async () => {
    const MODEL_URL = `${process.env.PUBLIC_URL}/models`;
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    setModelsLoaded(true);
  };

  // -------- Référence visage
  const loadReferenceImage = async (uid) => {
    try {
      const res = await axios.get(`https://bioscanner.onrender.com/api/pictures/${uid}`);
      const url = res.data.imageUrl?.startsWith("http")
        ? res.data.imageUrl
        : `https://bioscanner.onrender.com/${res.data.imageUrl}`;
      const img = await faceapi.fetchImage(url);
      const det = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (det) {
        setLabeledDescriptor(
          new faceapi.LabeledFaceDescriptors("Utilisateur", [det.descriptor])
        );
      } else {
        setMessage("Visage de référence non détecté.");
      }
    } catch {
      setMessage("Erreur chargement image de référence.");
    }
  };

  // -------- Vérifier si déjà pointé aujourd’hui
  const checkPresenceOnServer = async (uid) => {
    try {
      const res = await axios.get(`https://bioscanner.onrender.com/api/presence/user/${uid}`);
      const today = new Date().toLocaleDateString("fr-FR");
      const found = res.data.some(
        (p) => new Date(p.timestamp).toLocaleDateString("fr-FR") === today
      );
      if (found) {
        setAlreadyPresent(true);
        setSuccess(true);
        setMessage("Présence déjà validée !");
        localStorage.setItem("lastScanDate", today);
      }
    } catch {
      // Optionnel : afficher une erreur
    }
  };

  // -------- Lancer un scan
  const handleFaceScan = async () => {
    if (alreadyPresent) return;

    setMessage("");
    setSuccess(false);
    setFailed(false);

    if (!modelsLoaded || !labeledDescriptor) {
      setMessage("Modèles ou image de référence non disponibles.");
      return;
    }

    // Évite les flux multiples si on relance un scan
    if (videoRef.current?.srcObject) {
      stopWebcam();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = videoRef.current;
      video.srcObject = stream;

      // Utilise l’événement pour démarrer la détection une fois la vidéo prête
      const onLoaded = () => {
        video.removeEventListener("loadeddata", onLoaded);
        startFaceDetection();
      };
      video.addEventListener("loadeddata", onLoaded);

      await video.play();
    } catch {
      setMessage("Erreur d’accès à la webcam.");
    }
  };

  // -------- Enregistrer la présence (appelé APRÈS avoir coupé la webcam)
  const recordPresence = async () => {
    if (!navigator.geolocation) {
      setMessage("Géolocalisation non supportée.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await axios.post("https://bioscanner.onrender.com/api/presence/add", {
            userId,
            latitude,
            longitude,
          });

          const today = new Date().toLocaleDateString("fr-FR");
          localStorage.setItem(`lastScanDate_${userId}`, today);

          if (res.data.value === false) {
            setAlreadyPresent(false);
            setSuccess(false);
            setFailed(true);
            setMessage(res.data.message || "En dehors du périmètre du local.");
            return;
          }
          setAlreadyPresent(true);
          setMessage(res.data.message || "Présence enregistrée.");
        } catch {
          setMessage("Erreur lors de l'enregistrement.");
        }
      },
      () => setMessage("Erreur de géolocalisation.")
    );
  };

  // -------- Boucle de détection
  const startFaceDetection = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = faceapi.createCanvasFromMedia(video);
    if (canvasContainerRef.current) {
      canvasContainerRef.current.innerHTML = "";
      canvasContainerRef.current.appendChild(canvas);
    }

    const size = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, size);
    const matcher = new faceapi.FaceMatcher(labeledDescriptor, 0.4);

    intervalRef.current = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resized = faceapi.resizeResults(detections, size);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let matched = false;
      resized.forEach((d) => {
        const best = matcher.findBestMatch(d.descriptor);
        const lbl = best.label === "unknown" ? "Inconnu ❌" : "Reconnu ✅";
        new faceapi.draw.DrawBox(d.detection.box, { label: lbl }).draw(canvas);
        if (best.label !== "unknown") matched = true;
      });

      if (resized.length === 0) {
        setMessage("Aucun visage détecté.");
        return;
      }

      if (matched) {
        setMessage("Visage reconnu !");
        setLoading(true);
        // On coupe la webcam AVANT l'appel réseau pour libérer la ressource
        stopWebcam();
        await recordPresence();
        setLoading(false);
      } else {
        setMessage("Visage non reconnu.");
        setFailed(true);
        stopWebcam(); // arrêt centralisé (interval + tracks + canvas)
      }
    }, 1000);
  };

  return (
    <section className="container-scanner">
      {!alreadyPresent && (
        <div>
          {!modelsLoaded || !labeledDescriptor || loading ? (
            <Spinner animation="grow" variant="dark" className="m-auto" />
          ) : (
            <div>
              <p className="dateText">
                Date
                <br />
                <span>{dateString}</span>
              </p>
              <p className="instruction">Veuillez justifier votre présence</p>

              <button className="button" onClick={handleFaceScan} disabled={alreadyPresent}>
                <img className="buttonIcon" src={faceidIcon} alt="Face ID" />
                <span className="buttonText">Face ID</span>
              </button>

              {!success && !failed && !alreadyPresent && (
                <>
                  <video className="video" ref={videoRef} muted playsInline />
                  <div ref={canvasContainerRef}></div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {success || alreadyPresent ? (
        <>
          <SuccessCheck />
          <div className="messageSuccess">Présence validée !</div>
        </>
      ) : failed ? (
        <>
          <RedCross />
          {message && <div className="messageFailed">{message}</div>}
        </>
      ) : (
        message && <div className="messageFailed">{message}</div>
      )}
    </section>
  );
};

export default Scanner;
