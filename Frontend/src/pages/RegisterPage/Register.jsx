import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, getLocal } from "../../services/api"; // Chemin à adapter
import "./index.css";
import fingerprint from "../../assets/fingerprint.png";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locals, setLocals] = useState([]);
  const [entreprise, setEntreprise] = useState(""); // Ici, entreprise = localId si besoin
  useEffect(() => {
    const fetchLocals = async () => {
      try {
        const locals = await getLocal();
        setLocals(locals);
        console.log("Locals disponibles:", locals);
      } catch (error) {
        console.error("Erreur lors de la récupération des locaux:", error);
      }
    };
    fetchLocals();
  }, [locals.length]);
  const handleRegister = async () => {
    if (nom && email && password && entreprise) {
      try {
        const response = await register(nom, email, password, entreprise);
        // Sauvegarder le token dans le localStorage ou un contexte
        localStorage.setItem("token", response.token);
        navigate("/home");
      } catch (error) {
        console.error(
          "Erreur lors de l'inscription:",
          error.response?.data?.message || error.message
        );
        alert(error.response?.data?.message || "Erreur lors de l'inscription");
      }
    }
  };

  return (
    <div className="container">
      <div className="logoContainer">
        <img src={fingerprint} className="logo" alt="fingerprint" />
        <h2 className="logoText">Bio Scanner</h2>
      </div>
      <h3 className="title">Inscription</h3>
      <input
        className="input"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
      <input
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <input
        className="input"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      {/* <input
        className="input"
        placeholder="Entreprise (LocalID)"
        value={entreprise}
        onChange={(e) => setEntreprise(e.target.value)}
      /> */}
      <select className="select" value={entreprise} onChange={(e) => setEntreprise(e.target.value)}>
          <option key="default"value={null} >
            Sélectionner une entreprise
          </option>
        {locals.map((local) => (
          <option key={local._id} value={local._id}>
            {local.nom}
          </option>
        ))}
      </select>
      <button className="button" onClick={handleRegister}>
        S'inscrire
      </button>
      <div className="registerContainer">
        <p className="registerText">Vous avez déjà un compte ?</p>
        <button className="registerLink" onClick={() => navigate("/login")}>
          Se connecter
        </button>
      </div>
    </div>
  );
}
