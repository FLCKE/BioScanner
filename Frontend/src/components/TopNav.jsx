import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  MdQrCodeScanner,
  MdDescription,
  MdHistory,
  MdFingerprint,
  MdAccountCircle,
  MdMenu,
  MdClose,
  MdLogout
} from 'react-icons/md';

const TopNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail'); // Récupération de l'email
  const hiddenRoutes = ['/login', '/register', '/'];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.left}>
        <MdFingerprint style={styles.logoIcon} />
        <span style={styles.logoText}>Bio Scanner</span>
      </div>

      {/* Liens Desktop */}
      <div style={styles.center} className="nav-center">
        <NavLink to="/home" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>
          <MdQrCodeScanner style={styles.icon} />
          <span>Scanner</span>
        </NavLink>
        <NavLink to="/justificatif" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>
          <MdDescription style={styles.icon} />
          <span>Justificatif</span>
        </NavLink>
        <NavLink to="/historique" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>
          <MdHistory style={styles.icon} />
          <span>Historique</span>
        </NavLink>
      </div>

      {/* Icône Hamburger (mobile) */}
      <div style={styles.hamburger} className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <MdClose size={32} /> : <MdMenu size={32} />}
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div style={styles.mobileMenu} className="nav-mobile-menu">
          <NavLink to="/home" style={({ isActive }) => ({ ...styles.mobileLink, ...(isActive ? styles.active : {}) })} onClick={() => setMenuOpen(false)}>
            <MdQrCodeScanner style={styles.icon} />
            <span>Scanner</span>
          </NavLink>
          <NavLink to="/justificatif" style={({ isActive }) => ({ ...styles.mobileLink, ...(isActive ? styles.active : {}) })} onClick={() => setMenuOpen(false)}>
            <MdDescription style={styles.icon} />
            <span>Justificatif</span>
          </NavLink>
          <NavLink to="/historique" style={({ isActive }) => ({ ...styles.mobileLink, ...(isActive ? styles.active : {}) })} onClick={() => setMenuOpen(false)}>
            <MdHistory style={styles.icon} />
            <span>Historique</span>
          </NavLink>
          {token && (
            <>
              <NavLink to="/profil" style={({ isActive }) => ({ ...styles.mobileLink, ...(isActive ? styles.active : {}) })} onClick={() => setMenuOpen(false)}>
                <MdAccountCircle style={styles.icon} />
                <span>Profil</span>
              </NavLink>
              <div onClick={handleLogout} style={styles.mobileLink}>
                <MdLogout style={styles.icon} />
                <span>Déconnexion</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Droite : Desktop profil + déconnexion */}
      <div style={styles.right}>
        {token && (
          <>
            <span style={styles.userEmail}>{userEmail}</span>
            <NavLink to="/profil" style={styles.profileLink}>
              <MdAccountCircle style={styles.userIcon} />
            </NavLink>
            <button onClick={handleLogout} style={styles.logoutButton}>Déconnexion</button>
          </>
        )}
      </div>

      {/* Styles responsive */}
      <style>{`
        @media (max-width: 800px) {
          .nav-center {
            display: none;
          }
          .nav-hamburger {
            display: flex !important;
          }
        }
        @media (min-width: 801px) {
          .nav-hamburger {
            display: none !important;
          }
          .nav-mobile-menu {
            display: none !important;
          }
        }
        .nav-mobile-menu {
          position: absolute;
          top: 64px;
          left: 0;
          right: 0;
          background: #fff;
          box-shadow: 0 4px 8px rgba(0,0,0,0.07);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2000;
        }
      `}</style>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 32px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ccc',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 64,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 180,
  },
  logoIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
    letterSpacing: 1,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    gap: 48,
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'color 0.2s',
  },
  active: {
    color: '#000',
    fontWeight: 'bold',
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  userEmail: {
    fontSize: '14px',
    color: '#333',
  },
  profileLink: {
    textDecoration: 'none',
  },
  userIcon: {
    width: 28,
    height: 28,
    color: '#222',
  },
  logoutButton: {
    background: 'none',
    border: '1px solid #ccc',
    borderRadius: 4,
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: 14,
    color: '#333',
  },
  hamburger: {
    display: 'none',
    alignItems: 'center',
    cursor: 'pointer',
    marginLeft: 16,
    marginRight: 16,
    zIndex: 2001,
  },
  mobileLink: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    padding: '18px 0',
    width: '100%',
    justifyContent: 'center',
    borderBottom: '1px solid #eee',
  },
};

export default TopNav;
