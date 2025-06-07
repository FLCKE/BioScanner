import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import faceidIcon from '../assets/faceid.png';

// Styled Components (inchangés)
const Container = styled.div`
  background-color: #fff;
  padding: 20px;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 50px;
`;

const DateText = styled.p`
  font-size: 16px;
  font-weight: bold;
`;

const Instruction = styled.p`
  font-weight: bold;
  font-size: 15px;
  margin: 15px 0;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  background-color: #000;
  border: none;
  border-radius: 8px;
  height: 48px;
  width: 240px;
  margin: 8px auto;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    width: 98vw;
    max-width: 320px;
  }
`;

const ButtonIcon = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 10px;
`;

const ButtonText = styled.span`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const Video = styled.video`
  display: block;
  margin: 20px auto;
  border: 1px solid #ccc;
  width: 90vw;
  max-width: 400px;
  height: auto;

  @media (max-width: 600px) {
    width: 98vw;
    height: auto;
  }
`;

const Message = styled.div`
  margin: 20px auto;
  padding: 16px 24px;
  font-size: 20px;
  font-weight: bold;
  color: ${({ $success }) => ($success ? 'green' : 'red')};
  background: ${({ $success }) => ($success ? '#e6ffe6' : '#ffe6e6')};
  border-radius: 8px;
  width: fit-content;
`;

const SuccessCheck = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '32px auto' }}>
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="54" fill="none" stroke="#0D1B3E" strokeWidth="4" />
      <polyline points="40,65 55,80 80,50" fill="none" stroke="#19C99A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const RedCross = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '32px auto' }}>
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="54" fill="none" stroke="#B00020" strokeWidth="4" />
      <line x1="40" y1="40" x2="80" y2="80" stroke="#B00020" strokeWidth="8" strokeLinecap="round" />
      <line x1="80" y1="40" x2="40" y2="80" stroke="#B00020" strokeWidth="8" strokeLinecap="round" />
    </svg>
  </div>
);

const Scanner = () => {
  const videoRef = useRef();
  const canvasContainerRef = useRef();
  const intervalRef = useRef();

  const [userId, setUserId] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [labeledDescriptor, setLabeledDescriptor] = useState(null);
  const [dateString, setDateString] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [alreadyPresent, setAlreadyPresent] = useState(false);

  // 1) Initialisation : userId + date + check localStorage
  useEffect(() => {
    const uid = localStorage.getItem('userId');
    setUserId(uid);
    const today = new Date().toLocaleDateString('fr-FR');
    setDateString(today);

    const lastScan = localStorage.getItem(`lastScanDate_${uid}`);
if (lastScan === today) {
  setAlreadyPresent(true);
  setSuccess(true);
  setMessage("Présence déjà validée aujourd'hui.");
}
  }, []);

  // 2) Dès que userId est connu ET qu'on n'a pas déjà validé localement :
  useEffect(() => {
    if (!userId || alreadyPresent) return;

    const init = async () => {
      await loadModels();
      await loadReferenceImage(userId);
      await checkPresenceOnServer(userId);
    };

    init();
    return () => { clearInterval(intervalRef.current); stopWebcam(); };
  }, [userId, alreadyPresent]);

  // 3) Chargement des modèles
  const loadModels = async () => {
    const MODEL_URL = `${process.env.PUBLIC_URL}/models`;
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    setModelsLoaded(true);
  };

  // 4) Charger la photo de référence depuis l'API
  const loadReferenceImage = async uid => {
    try {
      const res = await axios.get(`http://localhost:5000/api/pictures/${uid}`);
      const url = res.data.imageUrl.startsWith('http')
        ? res.data.imageUrl
        : `http://localhost:5000${res.data.imageUrl}`;
      const img = await faceapi.fetchImage(url);
      const det = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (det) setLabeledDescriptor(new faceapi.LabeledFaceDescriptors('Utilisateur', [det.descriptor]));
      else setMessage("Visage de référence non détecté.");
    } catch {
      setMessage("Erreur chargement image de référence.");
    }
  };

  // 5) Vérification côté serveur (sécurité)
  const checkPresenceOnServer = async uid => {
    try {
      const res = await axios.get(`http://localhost:5000/api/presence/user/${uid}`);
      const today = new Date().toLocaleDateString('fr-FR');
      const found = res.data.some(p => new Date(p.timestamp).toLocaleDateString('fr-FR') === today);
      if (found) {
        setAlreadyPresent(true);
        setSuccess(true);
        setMessage("Présence déjà validée !");
        localStorage.setItem('lastScanDate', today);
      }
    } catch (err) {
      console.error("Vérif serveur échouée :", err);
    }
  };

  // 6) Démarrage du scan facial
  const handleFaceScan = async () => {
    if (alreadyPresent) return;
    setMessage(''); setSuccess(false); setFailed(false);

    if (!modelsLoaded || !labeledDescriptor) {
      setMessage("Modèles ou image de référence non disponibles.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      videoRef.current.onloadeddata = () => startFaceDetection();
    } catch {
      setMessage("Erreur d’accès à la webcam.");
    }
  };

  // 7) Arrêter la caméra
  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
  };

  // 8) Enregistrement de la présence + géoloc + lastScanDate
  const recordPresence = async () => {
    if (!navigator.geolocation) {
      setMessage("Géolocalisation non supportée.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await axios.post('http://localhost:5000/api/presence/add', {
            userId,
            latitude,
            longitude,
          });
          const today = new Date().toLocaleDateString('fr-FR');
        localStorage.setItem(`lastScanDate_${userId}`, today);
          setAlreadyPresent(true);
          setMessage(res.data.message || "Présence enregistrée.");
        } catch {
          setMessage("Erreur lors de l'enregistrement.");
        }
      },
      () => setMessage("Erreur de géolocalisation.")
    );
  };

  // 9) Boucle de détection faciale
  const startFaceDetection = () => {
    const video = videoRef.current;
    const canvas = faceapi.createCanvasFromMedia(video);
    canvasContainerRef.current.innerHTML = '';
    canvasContainerRef.current.appendChild(canvas);

    const size = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, size);
    const matcher = new faceapi.FaceMatcher(labeledDescriptor, 0.4);

    intervalRef.current = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resized = faceapi.resizeResults(detections, size);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let matched = false;
      resized.forEach(d => {
        const best = matcher.findBestMatch(d.descriptor);
        const lbl = best.label === 'unknown' ? 'Inconnu ❌' : 'Reconnu ✅';
        new faceapi.draw.DrawBox(d.detection.box, { label: lbl }).draw(canvas);
        if (best.label !== 'unknown') matched = true;
      });

      if (resized.length === 0) {
        setMessage("Aucun visage détecté.");
      } else if (matched) {
        setMessage("Visage reconnu !");
        setSuccess(true);
        clearInterval(intervalRef.current);
        stopWebcam();
        await recordPresence();
      } else {
        setMessage("Visage non reconnu.");
        setFailed(true);
        clearInterval(intervalRef.current);
        stopWebcam();
      }
    }, 1000);
  };

  return (
    <Container>
      <DateText>Date<br/><span>{dateString}</span></DateText>
      <Instruction>Veuillez justifier votre présence</Instruction>

      <Button onClick={handleFaceScan} disabled={alreadyPresent}>
        <ButtonIcon src={faceidIcon} alt="Face ID"/>
        <ButtonText>Face ID</ButtonText>
      </Button>

      {!success && !failed && !alreadyPresent && (
        <>
          <Video ref={videoRef} muted playsInline/>
          <div ref={canvasContainerRef}></div>
        </>
      )}

      {(success || alreadyPresent) ? (
        <>
          <SuccessCheck/>
          <Message $success={true}>Présence validée !</Message>
        </>
      ) : failed ? (
        <>
          <RedCross/>
          <Message $success={false}>Visage non reconnu.</Message>
        </>
      ) : (
        message && <Message $success={false}>{message}</Message>
      )}
    </Container>
  );
};

export default Scanner;
