import React, { useRef, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Webcam from "react-webcam";
import { uploadUserPicture } from '../services/api';

const Container = styled.div`
  background-color: #fff;
  padding: 32px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 50px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 28px;
  color: #0D1B3E;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  max-width: 340px;
`;

const FileInput = styled.input`
  margin-bottom: 10px;
`;

const Preview = styled.img`
  max-width: 220px;
  margin: 18px auto;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  display: block;
`;

const Error = styled.div`
  color: #B00020;
  margin-bottom: 12px;
  font-weight: 500;
`;

const Success = styled.div`
  color: #19C99A;
  margin-top: 14px;
  font-weight: bold;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  background-color: #0D1B3E;
  color: #fff;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
  &:hover {
    background-color: #19C99A;
    color: #0D1B3E;
  }
`;

const WebcamButton = styled.button`
  background-color: #19C99A;
  color: #0D1B3E;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
  margin-top: 6px;
  margin-bottom: 12px;
  cursor: pointer;
`;

export default function PhotoUpload({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);
  const userId = localStorage.getItem('userId');

  // Libération de l'URL de prévisualisation
  useEffect(() => {
    return () => {
      if (preview && typeof preview === "string" && preview.startsWith("blob:")) {
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
    setError('');
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
    setError('');
    setSuccess(false);
  }, [webcamRef, preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview) {
      setError('Veuillez sélectionner ou prendre une photo.');
      setSuccess(false);
      return;
    }
    setLoading(true);

    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    } else {
      const res = await fetch(preview);
      const blob = await res.blob();
      formData.append('image', blob, 'webcam.jpg');
    }
    formData.append('userId', userId);

    try {
      await uploadUserPicture(formData);
      setError('');
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Erreur lors de l'envoi de la photo.");
      setSuccess(false);
    }
    setLoading(false);
  };

  return (
    <Container>
      <Title>Ajouter votre photo de référence</Title>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="photo-upload" style={{display:'none'}}>Photo</label>
        <FileInput id="photo-upload" type="file" accept="image/*" onChange={handleChange} />
        <WebcamButton type="button" onClick={() => setUseWebcam(!useWebcam)}>
          {useWebcam ? "Annuler la webcam" : "Prendre une photo avec la webcam"}
        </WebcamButton>
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
            <WebcamButton type="button" onClick={capture}>
              Capturer la photo
            </WebcamButton>
          </>
        )}
        {preview && <Preview src={preview} alt="Prévisualisation" />}
        {error && <Error aria-live="polite">{error}</Error>}
        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer la photo"}
        </SubmitButton>
        {success && <Success aria-live="polite">Photo enregistrée avec succès !</Success>}
      </Form>
    </Container>
  );
}
