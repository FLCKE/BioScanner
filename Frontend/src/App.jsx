import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Scanner from "./pages/ScannerPage/Scanner";
import LoginScreen from "./pages/LoginPage/Login";
import RegisterScreen from "./pages/RegisterPage/Register";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import HistoriqueScreen from "./pages/HistoriquePage/Historique";
import JustificationScreen from "./pages/JustificationPage/Justification";
import PhotoUpload from "./pages/PhotoUploadPage/PhotoUpload";
import TopNav from "./components/NavBar/TopNav";
import Profil from "./components/Profil";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/historique" element={<HistoriqueScreen />} />
        <Route path="/justificatif" element={<JustificationScreen />} />
        <Route path="/PhotoUpload" element={<PhotoUpload />} />
        <Route path="/home" element={<Scanner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
