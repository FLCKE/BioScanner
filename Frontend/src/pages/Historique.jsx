import React, { useEffect, useState } from 'react';
import './styles1.css';
import fingerprint from '../assets/fingerprint.png';
import profil from '../assets/profil.png';
import { getPresencesByUserId } from '../services/api'; // vérifie le bon chemin

export default function HistoriqueScreen() {
  const [data, setData] = useState([]);
  const userId = localStorage.getItem('userId'); // stocké après login

  useEffect(() => {
    const fetchData = async () => {
      try {
        const presences = await getPresencesByUserId(userId);
        const formatted = presences.map((item, index) => ({
          id: item._id || index.toString(),
          date: new Date(item.timestamp).toLocaleDateString('fr-FR'), // formatage FR
          status: 'Présent', // ou une logique spécifique selon les cas
        }));
        setData(formatted);
      } catch (error) {
        console.error('Erreur lors du chargement des présences :', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  return (
    <div className="container">
      <header className="header">
        <div className="header-left">
          <img src={fingerprint} className="logo" alt="fingerprint" />
          <h2 className="title">Bio Scanner</h2>
        </div>
        <img src={profil} className="logo" alt="profil" />
      </header>

      <h3 className="section-title">Historiques</h3>

      <div className="list">
        {data.map(item => (
          <div className="item" key={item.id}>
            <p className="item-date">Date<br />{item.date}</p>
            <p className="item-status" style={{ backgroundColor: '#2e7d32' }}>
              {item.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
