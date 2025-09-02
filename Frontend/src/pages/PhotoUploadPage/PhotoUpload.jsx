import React, { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { uploadUserPicture } from "../../services/api";
import "./index.css";

export default function PhotoUpload({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      if (
        preview &&
        typeof preview === "string" &&
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (preview && typeof preview === "string" && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
    setUseWebcam(false);
    setError("");
    setSuccess(false);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (preview && typeof preview === "string" && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(imageSrc);
    setFile(null);
    setUseWebcam(false);
    setError("");
    setSuccess(false);
  }, [webcamRef, preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview) {
      setError("Veuillez sélectionner ou prendre une photo.");
      setSuccess(false);
      return;
    }
    setLoading(true);

    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    } else {
      const res = await fetch(preview);
      const blob = await res.blob();
      formData.append("image", blob, "webcam.jpg");
    }
    formData.append("userId", userId);

    try {
      await uploadUserPicture(formData);
      setError("");
      setSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
      navigate("/home");
    } catch (err) {
      setError("Erreur lors de l'envoi de la photo.");
      setSuccess(false);
    }
    setLoading(false);
  };

  return (
    <div className="container-photo-upload">
      <h2 className="title">Ajouter votre photo de référence</h2>
      <form className="form-photo-upload" onSubmit={handleSubmit}>
        <label htmlFor="photo-upload" style={{ display: "none" }}>
          Photo
        </label>
        {!useWebcam && (
          <input
            className="fileInput"
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        )}
        <span>OU</span>
        <button
          className="webcamButton"
          type="button"
          onClick={() => setUseWebcam(!useWebcam)}
        >
          {useWebcam ? "Annuler la webcam" : "Prendre une photo avec la webcam"}
        </button>
        {useWebcam && (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={220}
              videoConstraints={{ facingMode: "user" }}
              style={{ borderRadius: 12, margin: "10px auto" }}
            />
            <button className="webcamButton" type="button" onClick={capture}>
              Capturer la photo
            </button>
          </>
        )}
        {preview && (
          <img className="preview" src={preview} alt="Prévisualisation" />
        )}
        {error && (
          <div className="error" aria-live="polite">
            {error}
          </div>
        )}
        <button className="submitButton" type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer la photo"}
        </button>
        {success && (
          <div className="success" aria-live="polite">
            Photo enregistrée avec succès !
          </div>
        )}
      </form>
    </div>
  );
}
