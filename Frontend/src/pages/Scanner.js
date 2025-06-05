import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as faceapi from 'face-api.js';
import Header from '../components/Header';
import printIcon from '../assets/print.png';
import faceidIcon from '../assets/faceid.png';

const Container = styled.div`
  background-color: #fff;
  padding: 20px;
  text-align: center;
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
`;

const Message = styled.div`
  margin: 20px auto;
  padding: 16px 24px;
  font-size: 20px;
  font-weight: bold;
  color: ${({ success }) => (success ? 'green' : 'red')};
  background: ${({ success }) => (success ? '#e6ffe6' : '#ffe6e6')};
  border-radius: 8px;
  width: fit-content;
`;

const Scanner = () => {
  const videoRef = useRef();
  const canvasContainerRef = useRef();
  const intervalRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [labeledDescriptor, setLabeledDescriptor] = useState(null);
  const [dateString, setDateString] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${('0' + today.getDate()).slice(-2)}/${('0' + (today.getMonth() + 1)).slice(-2)}/${today.getFullYear()}`;
    setDateString(formattedDate);
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        await loadReferenceImage();
      } catch (error) {
        console.error('Erreur chargement des modèles :', error);
        setMessage("Erreur chargement des modèles.");
        setSuccess(false);
      }
    };

    loadModels();
    // Nettoyage de l'intervalle au démontage
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line
  }, []);

  const loadReferenceImage = async () => {
    try {
      const image = await faceapi.fetchImage(process.env.PUBLIC_URL + '/known/photo.jpg');
      const detection = await faceapi
        .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const labeled = new faceapi.LabeledFaceDescriptors('Utilisateur', [detection.descriptor]);
        setLabeledDescriptor(labeled);
      } else {
        setMessage("Visage de référence non détecté.");
        setSuccess(false);
        console.warn("Visage de référence non détecté.");
      }
    } catch (err) {
      setMessage("Erreur lors du chargement de l'image de référence.");
      setSuccess(false);
      console.error("Erreur lors du chargement de l'image de référence :", err);
    }
  };

  const handleFaceScan = async () => {
    if (!modelsLoaded || !labeledDescriptor) {
      setMessage("Modèles ou référence non chargés.");
      setSuccess(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      videoRef.current.onloadeddata = () => {
        startFaceDetection();
      };
    } catch (err) {
      setMessage("Erreur d’accès à la webcam.");
      setSuccess(false);
      console.error('Erreur d’accès à la webcam :', err);
    }
  };

  const startFaceDetection = () => {
    const video = videoRef.current;
    const canvas = faceapi.createCanvasFromMedia(video);
    canvasContainerRef.current.innerHTML = '';
    canvasContainerRef.current.appendChild(canvas);

    const displaySize = {
      width: video.videoWidth,
      height: video.videoHeight,
    };
    faceapi.matchDimensions(canvas, displaySize);

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptor, 0.4);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      let foundMatch = false;

      resizedDetections.forEach(detection => {
        const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
        const label = bestMatch.label === 'unknown' ? 'Inconnu ❌' : 'Reconnu ✅';
        // Affiche la distance pour debug
        console.log('Distance:', bestMatch.distance, 'Label:', bestMatch.label);

        const drawBox = new faceapi.draw.DrawBox(detection.detection.box, { label });
        drawBox.draw(canvas);

        if (bestMatch.label !== 'unknown') {
          foundMatch = true;
        }
      });

      if (resizedDetections.length === 0) {
        setMessage("Aucun visage détecté.");
        setSuccess(false);
      } else if (foundMatch) {
        setMessage("Visage reconnu !");
        setSuccess(true);
      } else {
        setMessage("Visage trop vilain !");
        setSuccess(false);
      }
    }, 1000);
  };

  return (
    <Container>
      <Header />
      <DateText>
        Date<br />
        <span>{dateString}</span>
      </DateText>
      <Instruction>Veuillez justifier votre présence</Instruction>
      <Button>
        <ButtonIcon src={printIcon} alt="Empreinte digitale" />
        <ButtonText>Empreinte digitale</ButtonText>
      </Button>
      <Button onClick={handleFaceScan}>
        <ButtonIcon src={faceidIcon} alt="Face ID" />
        <ButtonText>Face ID</ButtonText>
      </Button>

      <Video ref={videoRef} muted width="720" height="560" />
      <div ref={canvasContainerRef}></div>
      {message && <Message success={success}>{message}</Message>}
    </Container>
  );
};

export default Scanner;
