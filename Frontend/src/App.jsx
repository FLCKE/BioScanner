import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Scanner from './pages/Scanner';
import LoginScreen from './pages/Login';
import RegisterScreen from './pages/Register';
import SplashScreen from './pages/SplashScreen';
import HistoriqueScreen from './pages/Historique';
import JustificationScreen from './pages/Justification';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/historique" element={<HistoriqueScreen />} />
        <Route path="/justificatif" element={<JustificationScreen />} />
        
        <Route path="/home" element={<Scanner />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
