import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  MdQrCodeScanner,
  MdDescription,
  MdHistory,
  MdFingerprint,
  MdAccountCircle,
  MdMenu,
  MdClose,
  MdLogout,
} from "react-icons/md";
import "./index.css";

const TopNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");
  const hiddenRoutes = ["/login", "/register", "/"];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <nav className="topnav-nav">
      {/* Logo */}
      <div className="topnav-left">
        <MdFingerprint className="topnav-logo-icon" />
        <span className="topnav-logo-text">Bio Scanner</span>
      </div>

      {/* Liens Desktop */}
      <div className="topnav-center nav-center">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? "topnav-link active" : "topnav-link"
          }
        >
          <MdQrCodeScanner className="topnav-icon" />
          <span>Scanner</span>
        </NavLink>
        <NavLink
          to="/justificatif"
          className={({ isActive }) =>
            isActive ? "topnav-link active" : "topnav-link"
          }
        >
          <MdDescription className="topnav-icon" />
          <span>Justificatif</span>
        </NavLink>
        <NavLink
          to="/historique"
          className={({ isActive }) =>
            isActive ? "topnav-link active" : "topnav-link"
          }
        >
          <MdHistory className="topnav-icon" />
          <span>Historique</span>
        </NavLink>
      </div>

      {/* Icône Hamburger (mobile) */}
      <div
        className="topnav-hamburger nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <MdClose size={32} /> : <MdMenu size={32} />}
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="topnav-mobile-menu nav-mobile-menu">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "topnav-mobile-link active" : "topnav-mobile-link"
            }
            onClick={() => setMenuOpen(false)}
          >
            <MdQrCodeScanner className="topnav-icon" />
            <span>Scanner</span>
          </NavLink>
          <NavLink
            to="/justificatif"
            className={({ isActive }) =>
              isActive ? "topnav-mobile-link active" : "topnav-mobile-link"
            }
            onClick={() => setMenuOpen(false)}
          >
            <MdDescription className="topnav-icon" />
            <span>Justificatif</span>
          </NavLink>
          <NavLink
            to="/historique"
            className={({ isActive }) =>
              isActive ? "topnav-mobile-link active" : "topnav-mobile-link"
            }
            onClick={() => setMenuOpen(false)}
          >
            <MdHistory className="topnav-icon" />
            <span>Historique</span>
          </NavLink>
          {token && (
            <>
              <NavLink
                to="/profil"
                className={({ isActive }) =>
                  isActive ? "topnav-mobile-link active" : "topnav-mobile-link"
                }
                onClick={() => setMenuOpen(false)}
              >
                <MdAccountCircle className="topnav-icon" />
                <span>Profil</span>
              </NavLink>
              <div onClick={handleLogout} className="topnav-mobile-link">
                <MdLogout className="topnav-icon" />
                <span>Déconnexion</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Droite : Desktop profil + déconnexion */}
      <div className="topnav-right">
        {token && (
          <>
            <span className="topnav-user-email">{userEmail}</span>
            <NavLink to="/profil" className="topnav-profile-link">
              <MdAccountCircle className="topnav-user-icon" />
            </NavLink>
            <button onClick={handleLogout} className="topnav-logout-button">
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
