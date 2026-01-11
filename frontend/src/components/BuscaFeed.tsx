import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaAngleDown } from 'react-icons/fa';
import '../styles/BuscaFeed/BuscaFeed.css';

const BuscaFeed = ({ onBuscar }: { onBuscar?: (buscaLimpa: Record<string, string>) => void }) => {
  const [termo, setTermo] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState({
    categoria: '',
    especie: '',
    porte: '',
    localizacao: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setTermo(e.target.value);
  };

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleBuscar = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    // Monta objeto de busca combinando termo e filtros
    const buscaCompleta = {
      termo: termo.trim(),
      ...filtros
    };

    // Remove campos vazios
    const buscaLimpa = Object.fromEntries(
      Object.entries(buscaCompleta).filter(([_, value]) => value !== '')
    );

    // Se tiver callback, usa ele, senão navega
    if (onBuscar) {
      onBuscar(buscaLimpa);
    } else {
      // Navega para resultados com todos os parâmetros
      const params = new URLSearchParams(buscaLimpa).toString();
      navigate(`/busca?${params}`);
    }
  };

  const limparFiltros = () => {
    setTermo('');
    setFiltros({
      categoria: '',
      especie: '',
      porte: '',
      localizacao: ''
    });
  };

  return (
    <div className="busca-unificada-container">
      <form onSubmit={handleBuscar} className="busca-unificada-form">
        <div className="busca-principal">
          <div className="busca-input-wrapper">
            <FaSearch className="busca-icon" />
            <input
              type="text"
              className="busca-input"
              placeholder="Buscar animais por nome, descrição ou localização..."
              value={termo}
              onChange={handleInputChange}
            />
            <button 
              type="button" 
              className="toggle-filtros-btn"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              <FaFilter />
              <span>Filtros</span>
              <FaAngleDown className={`arrow ${mostrarFiltros ? 'up' : 'down'}`} />
            </button>
            <button type="submit" className="busca-submit-btn">
              Buscar
            </button>
          </div>
        </div>

        {mostrarFiltros && (
          <div className="filtros-rapidos">
            <div className="filtros-grid">
              <div className="filtro-group">
                <label>Categoria</label>
                <select 
                  value={filtros.categoria}
                  onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="Adocao">Adoção</option>
                  <option value="Perdido">Perdido</option>
                </select>
              </div>
              
              <div className="filtro-group">
                <label>Espécie</label>
                <select 
                  value={filtros.especie}
                  onChange={(e) => handleFiltroChange('especie', e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              
              <div className="filtro-group">
                <label>Porte</label>
                <select 
                  value={filtros.porte}
                  onChange={(e) => handleFiltroChange('porte', e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
              
              <div className="filtro-group">
                <label>Localização</label>
                <input 
                  type="text" 
                  placeholder="Cidade, Estado..."
                  value={filtros.localizacao}
                  onChange={(e) => handleFiltroChange('localizacao', e.target.value)}
                />
              </div>
            </div>
            
            <div className="filtros-actions">
              <button 
                type="button" 
                className="limpar-btn"
                onClick={limparFiltros}
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default BuscaFeed;