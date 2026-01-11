// BuscaFeed.jsx 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter } from 'react-icons/fa';
import '../styles/BuscaFeed/BuscaFeed.css';

const BuscaFeed = () => {
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const navigate = useNavigate();

  const filtros = [
    { id: 'todos', label: 'Todos os campos' },
    { id: 'especie', label: 'Espécie' },
    { id: 'localizacao', label: 'Localização' },
    { id: 'porte', label: 'Porte' },
    { id: 'nome', label: 'Nome do animal' },
  ];

  const handleBusca = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (termoBusca.trim()) {
      navigate(`/busca?q=${encodeURIComponent(termoBusca)}&filtro=${filtroAtivo}`);
    }
  };

  const handleKeyPress = (e: { key?: any; preventDefault: () => void; }) => {
    if (e.key === 'Enter') {
      handleBusca(e);
    }
  };

  return (
    <div className="busca-feed-container">
      <div className="busca-feed-input-wrapper">
        <div className="busca-filtro-selector">
          <button 
            className="filtro-dropdown-btn"
            onClick={() => setMostrarDropdown(!mostrarDropdown)}
            type="button"
          >
            <FaFilter />
            <span>{filtros.find(f => f.id === filtroAtivo)?.label}</span>
          </button>
          
          {mostrarDropdown && (
            <div className="filtro-dropdown">
              {filtros.map((filtro) => (
                <button
                  key={filtro.id}
                  className={`filtro-option ${filtroAtivo === filtro.id ? 'active' : ''}`}
                  onClick={() => {
                    setFiltroAtivo(filtro.id);
                    setMostrarDropdown(false);
                  }}
                  type="button"
                >
                  {filtro.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="busca-input-container">
          <FaSearch className="busca-feed-icon" />
          <input
            className="busca-feed-input"
            type="text"
            placeholder={`Buscar por ${filtros.find(f => f.id === filtroAtivo)?.label.toLowerCase()}...`}
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="busca-submit-btn"
            onClick={handleBusca}
            type="button"
            disabled={!termoBusca.trim()}
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuscaFeed;