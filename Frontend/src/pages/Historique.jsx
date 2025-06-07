import React, { useEffect, useState } from 'react';
import './styles1.css';
import { useLocation } from 'react-router-dom'; // ✅ Import pour détecter les changements de page
import { getPresencesByUserId } from '../services/api';

export default function HistoriqueScreen() {
  const [data, setData] = useState([]);
  const location = useLocation(); // ✅ Hook React Router
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const presences = await getPresencesByUserId(userId);
        const formatted = presences.map((item, index) => ({
          id: item._id || index.toString(),
          date: new Date(item.timestamp).toLocaleDateString('fr-FR'),
          status: 'Présent',
        }));
        setData(formatted);
      } catch (error) {
        console.error('Erreur lors du chargement des présences :', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, location]); // ✅ Déclenche le fetch à chaque changement d'URL

  return (
    <div className="container">
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
