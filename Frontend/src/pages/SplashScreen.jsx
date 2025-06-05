import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import fingerprint from '../assets/fingerprint.png';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splashContainer">
      <img src={fingerprint} alt="logo" style={{ width: 80, height: 80 }} />
      <h2 style={{ fontWeight: 'bold', fontSize: 22, marginTop: 10 }}>Bio Scanner</h2>
    </div>
  );
}
