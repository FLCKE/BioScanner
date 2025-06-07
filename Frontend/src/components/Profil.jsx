import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAccountCircle, MdEmail, MdLogout } from 'react-icons/md';

export default function Profil() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <MdAccountCircle size={64} color="#444" />
        <h2 style={styles.title}>Mon Profil</h2>
        <div style={styles.info}>
          <MdEmail style={styles.icon} />
          <span style={styles.text}>{userEmail || "Email inconnu"}</span>
        </div>
        <button style={styles.logoutButton} onClick={handleLogout}>
          <MdLogout style={{ marginRight: 8 }} />
          Déconnexion
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  card: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    maxWidth: 400,
    width: '100%',
    textAlign: 'center'
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222'
  },
  info: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555'
  },
  icon: {
    marginRight: 8
  },
  text: {
    fontSize: 16
  },
  logoutButton: {
    marginTop: 32,
    padding: '10px 20px',
    fontSize: 16,
    backgroundColor: '#e53935',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
