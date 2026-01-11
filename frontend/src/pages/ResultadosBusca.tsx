// ResultadosBusca.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NavbarPrincipal from '../components/NavbarPrincipal';
import BuscaFeed from '../components/BuscaFeed';
import { FaMapMarkerAlt, FaHeart, FaComment, FaStar } from 'react-icons/fa';
import '../styles/ResultadosBusca/ResultadosBusca.css';

interface Animal {
  id: number;
  nome: string;
  descricao: string;
  especie: string;
  porte: string;
  localizacao: string;
  foto_url: string;
  categoria: string;
  dono_nome: string;
  ong_nome?: string;
  protetor_nome?: string;
}

const ResultadosBusca = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [resultados, setResultados] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtrosAplicados, setFiltrosAplicados] = useState<any>({});

  // Função para buscar animais avançada
  const buscarAnimaisAvancada = async (filtros: any) => {
    try {
      const response = await fetch('http://localhost:3000/animais/busca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtros),
      });
      
      if (!response.ok) {
        throw new Error('Erro na busca');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  // Nova função para lidar com busca unificada
  const handleBuscaUnificada = async (filtros: any) => {
    setLoading(true);
    setError('');
    setFiltrosAplicados(filtros);
    
    try {
      const dados = await buscarAnimaisAvancada(filtros);
      setResultados(dados);
      
      // Atualiza URL com os filtros
      const params = new URLSearchParams(filtros).toString();
      navigate(`/busca?${params}`, { replace: true });
    } catch (err: any) {
      setError('Erro ao buscar animais: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carrega resultados baseado na URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filtros: any = {};
    
    // Converte parâmetros da URL para objeto
    params.forEach((value, key) => {
      filtros[key] = value;
    });
    
    if (Object.keys(filtros).length > 0) {
      setFiltrosAplicados(filtros);
      realizarBusca(filtros);
    } else {
      setLoading(false);
    }
  }, [location.search]);

  const realizarBusca = async (filtros: any) => {
    setLoading(true);
    setError('');
    
    try {
      const dados = await buscarAnimaisAvancada(filtros);
      setResultados(dados);
    } catch (err: any) {
      setError('Erro ao buscar animais: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const limparBusca = () => {
    setResultados([]);
    setFiltrosAplicados({});
    navigate('/busca');
  };

  const verDetalhesAnimal = (animalId: number) => {
    navigate(`/animal/${animalId}`);
  };

  return (
    <div className="search-results-page">
      <NavbarPrincipal />
      
      <div className="search-results-container">
        <div className="search-header">
          <div className="search-title-container">
            <h1 className="search-title">
              {Object.keys(filtrosAplicados).length > 0 
                ? 'Resultados da Busca' 
                : 'Buscar Animais'}
            </h1>
          </div>
          
          <div className="search-bar-container">
            <BuscaFeed onBuscar={handleBuscaUnificada} />
          </div>
        </div>

        <div className="resultados-container">
          <div className="resultados-info">
            {loading ? (
              <div className="resultados-mensagem">
                <div className="spinner"></div>
                <p>Buscando animais...</p>
              </div>
            ) : error ? (
              <div className="resultados-erro">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                  Tentar Novamente
                </button>
              </div>
            ) : resultados.length === 0 ? (
              <div className="resultados-vazios">
                <p>
                  {Object.keys(filtrosAplicados).length > 0
                    ? 'Nenhum animal encontrado com os critérios de busca.'
                    : 'Use a busca acima para encontrar animais para adoção ou perdidos.'}
                </p>
                {Object.keys(filtrosAplicados).length > 0 && (
                  <button onClick={limparBusca}>
                    Limpar busca
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="resultados-header">
                  <p className="contador-resultados">
                    {resultados.length} animal{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
                  </p>
                  {Object.keys(filtrosAplicados).length > 0 && (
                    <button 
                      className="limpar-resultados-btn"
                      onClick={limparBusca}
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>
                
                <div className="resultados-grid">
                  {resultados.map((animal) => (
                    <div 
                      key={animal.id} 
                      className="animal-card-resultado"
                      onClick={() => verDetalhesAnimal(animal.id)}
                    >
                      <div className="animal-card-header">
                        <div className="animal-card-user">
                          <div className="animal-card-avatar">
                            {animal.dono_nome?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <span className="animal-card-username">
                            {animal.dono_nome || 'Usuário'}
                          </span>
                        </div>
                        <span className={`animal-card-badge ${animal.categoria === 'Perdido' ? 'perdido' : 'adocao'}`}>
                          {animal.categoria === 'Perdido' ? 'PERDIDO' : 'ADOÇÃO'}
                        </span>
                      </div>
                      
                      <div className="animal-card-image">
                        <img 
                          src={animal.foto_url ? `http://localhost:3000/${animal.foto_url}` : 'https://images.unsplash.com/photo-1558788353-f76d92427f16'} 
                          alt={animal.nome} 
                        />
                      </div>
                      
                      <div className="animal-card-info">
                        <h3>{animal.nome}</h3>
                        <p className="animal-card-descricao">
                          {animal.descricao?.substring(0, 100)}
                          {animal.descricao?.length > 100 ? '...' : ''}
                        </p>
                        
                        <div className="animal-card-detalhes">
                          <div className="detalhe-item">
                            <strong>Espécie:</strong> {animal.especie}
                          </div>
                          <div className="detalhe-item">
                            <strong>Porte:</strong> {animal.porte}
                          </div>
                          <div className="detalhe-item">
                            <FaMapMarkerAlt /> {animal.localizacao}
                          </div>
                        </div>
                      </div>
                      
                      <div className="animal-card-actions">
                        <button className="action-btn like">
                          <FaHeart /> <span>0</span>
                        </button>
                        <button className="action-btn comment">
                          <FaComment /> <span>0</span>
                        </button>
                        <button className="action-btn favorite">
                          <FaStar />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadosBusca;