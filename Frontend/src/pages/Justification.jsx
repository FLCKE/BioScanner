import React from 'react';
import './styles1.css';
import fingerprint from '../assets/fingerprint.png';
import profil from '../assets/profil.png';

const data = [
  { id: '1', date: '05/05/2025', status: 'Absent' },
  { id: '2', date: '05/05/2025', status: 'Absent' },
  { id: '3', date: '05/05/2025', status: 'Absent' },
  { id: '4', date: '05/05/2025', status: 'Absent' },
  { id: '5', date: '05/05/2025', status: 'Absent' },
];

export default function JustificationScreen() {
  return (
    <div className="container">
      <header className="header">
        <div className="header-left">
          <img src={fingerprint} className="logo" alt="fingerprint" />
          <h2 className="title">Bio Scanner</h2>
        </div>
        <img src={profil} className="logo" alt="profil" />
      </header>

      <h3 className="section-title">Justificatifs</h3>

      <div className="list">
        {data.map(item => (
          <div className="item" key={item.id}>
            <p className="item-date">Date<br />{item.date}</p>
            <p className="item-status">{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
