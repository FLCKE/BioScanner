import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api'; 
import './styles.css';
import fingerprint from '../assets/fingerprint.png';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await login(email, password);
        // Sauvegarder le token dans le localStorage e
        localStorage.setItem('token', response.token);
        navigate('/home');
      } catch (error) {
         console.error("Erreur lors de l'inscription:", error.response?.data?.message || error.message);
        alert(error.response?.data?.message || "Email ou mot de passe incorrect");
      }
    }
  };

  return (
    <div className="container">
      <div className="logoContainer">
        <img src={fingerprint} className="logo" alt="fingerprint" />
        <h2 className="logoText">Bio Scanner</h2>
      </div>
      <h3 className="title">Connexion</h3>
      <input
        className="input"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"
      />
      <input
        className="input"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
      />
      <button className="button" onClick={handleLogin}>Se connecter</button>
      <div className="registerContainer">
        <p className="registerText">Vous n'avez pas encore de compte ?</p>
        <button className="registerLink" onClick={() => navigate('/register')}>S'inscrire</button>
      </div>
    </div>
  );
}
