import React from 'react';
import { useNavigate } from 'react-router-dom';
// NOVO: Import do hook de autenticação
import { useAuth } from '../contexts/AuthContext';
import '../styles/NavbarPrincipal/NavbarPrincipal.css';
// NOVO: Import do ícone de logout
import { FaRegImage, FaRegHeart, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const NavbarPrincipal: React.FC = () => {
  const navigate = useNavigate()
    // NOVO: Acessa user e função de logout
  const { user, logout } = useAuth();

  // NOVO: Função para fazer logout e redirecionar
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar-principal">
      {/* NOVO: Avatar mostra inicial do email do usuário */}
      <div className="navbar-avatar" title={user?.email || 'Usuário'}>
        {user?.email?.charAt(0).toUpperCase()}
      </div>
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
        {/* NOVO: Botão de logout */}
        <button className="navbar-item" onClick={handleLogout} style={{ marginTop: 'auto' }}>
          <FaSignOutAlt className="navbar-icon" />
          <span className="navbar-label">Sair</span>
        </button>
      </div>
    </nav>
  );
};

export default NavbarPrincipal;
