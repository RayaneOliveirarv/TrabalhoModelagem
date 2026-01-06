import React from 'react';
import '../styles/NavbarPrincipal/NavbarPrincipal.css';
import { useNavigate } from 'react-router-dom';
import { FaRegImage, FaRegHeart, FaUser, FaCog } from 'react-icons/fa';

const NavbarPrincipal: React.FC = () => {
  const navigate = useNavigate()

  return (
    <nav className="navbar-principal">
      <div className="navbar-avatar" />
      <div className="navbar-menu">
        <button className="navbar-item" onClick={()=>navigate("/Feed")}>
          <FaRegImage className="navbar-icon" />
          <span className="navbar-label">Feed</span>
        </button>
        <button className="navbar-item">
          <FaRegHeart className="navbar-icon" />
          <span className="navbar-label" onClick={()=>navigate("/Adocao")}>Adoção</span>
        </button>
        <button className="navbar-item" onClick={()=>navigate("/Perfil_page")}>
          <FaUser className="navbar-icon" />
          <span className="navbar-label">Perfil</span>
        </button>
        <button className="navbar-item" onClick={()=>navigate("/Configuracoes")}>
          <FaCog className="navbar-icon" onClick={()=>navigate("/Configuracoes")}/>
          <span className="navbar-label">Configurações</span>
        </button>
      </div>
    </nav>
  );
};

export default NavbarPrincipal;
