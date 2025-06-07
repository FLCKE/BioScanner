// src/pages/LoginScreen.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import fingerprint from '../assets/fingerprint.png';
import './styles.css';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await login(email, password);
      const userId = response.user?._id || response.userId;

      // Stocke l'utilisateur
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', response.user?.email || email);

      // Vérifie si la photo de référence existe
      const picRes = await fetch(`http://localhost:5000/api/pictures/${userId}`);
      const picData = await picRes.ok ? await picRes.json() : {};
      const hasPhoto = !!picData?.imageUrl;

      setError('');
      navigate(hasPhoto ? '/PhotoUpload':'/home' );
      // ❌ PAS de reload ici
    } catch (err) {
      console.error('Erreur login :', err);
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="container">
      <div className="logoContainer">
        <img src={fingerprint} className="logo" alt="Empreinte digitale" />
        <h2 className="logoText">Bio Scanner</h2>
      </div>

      <h3 className="title">Connexion</h3>
      <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />

      {error && <div className="errorMessage">{error}</div>}

      <button className="button" onClick={handleLogin}>Se connecter</button>

      <div className="registerContainer">
        <p className="registerText">Vous n'avez pas encore de compte ?</p>
        <button className="registerLink" onClick={() => navigate('/register')}>S'inscrire</button>
      </div>
    </div>
  );
}
