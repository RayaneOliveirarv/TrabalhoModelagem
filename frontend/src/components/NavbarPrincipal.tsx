import React from 'react';
import '../styles/NavbarPrincipal/NavbarPrincipal.css';
import { FaRegImage, FaRegHeart, FaUser, FaCog } from 'react-icons/fa';

const NavbarPrincipal: React.FC = () => {
  return (
    <nav className="navbar-principal">
      <div className="navbar-avatar" />
      <div className="navbar-menu">
        <button className="navbar-item">
          <FaRegImage className="navbar-icon" />
          <span className="navbar-label">Feed</span>
        </button>
        <button className="navbar-item">
          <FaRegHeart className="navbar-icon" />
          <span className="navbar-label">Adoção</span>
        </button>
        <button className="navbar-item">
          <FaUser className="navbar-icon" />
          <span className="navbar-label">Perfil</span>
        </button>
        <button className="navbar-item">
          <FaCog className="navbar-icon" />
          <span className="navbar-label">Configurações</span>
        </button>
      </div>
    </nav>
  );
};

export default NavbarPrincipal;
