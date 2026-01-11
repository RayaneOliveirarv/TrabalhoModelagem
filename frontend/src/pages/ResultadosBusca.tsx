// ResultadosBusca.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NavbarPrincipal from '../components/NavbarPrincipal';
import BuscaFeed from '../components/BuscaFeed';
import { FaMapMarkerAlt, FaHeart, FaComment, FaStar, FaFilter, FaTimes } from 'react-icons/fa';
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

interface FiltrosAvancados {
  especie: string;
  porte: string;
  localizacao: string;
  categoria: string;
}

const ResultadosBusca = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [resultados, setResultados] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtrosAvancados, setFiltrosAvancados] = useState<FiltrosAvancados>({
    especie: '',
    porte: '',
    localizacao: '',
    categoria: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

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

  // Extrai parâmetros da URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    const filtro = params.get('filtro');

    if (query) {
      // Se tiver um filtro específico na URL, aplica
      if (filtro && filtro !== 'todos') {
        setFiltrosAvancados(prev => ({
          ...prev,
          [filtro]: query
        }));
      }
      
      realizarBusca(query, filtro);
    }
  }, [location.search]);

  const realizarBusca = async (query: string, filtroEspecifico: string | null) => {
    setLoading(true);
    setError('');
    
    try {
      const filtros: any = { ...filtrosAvancados };
      
      // Se tiver um filtro específico, usa ele
      if (filtroEspecifico && filtroEspecifico !== 'todos') {
        filtros[filtroEspecifico] = query;
      } else if (query) {
        // Se for busca geral, busca em múltiplos campos
        filtros.termo = query;
      }

      // Remove filtros vazios
      const filtrosLimpos = Object.fromEntries(
        Object.entries(filtros).filter(([_, value]) => value !== '')
      );

      const dados = await buscarAnimaisAvancada(filtrosLimpos);
      setResultados(dados);
    } catch (err: any) {
      setError('Erro ao buscar animais: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo: keyof FiltrosAvancados, valor: string) => {
    setFiltrosAvancados(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const aplicarFiltros = () => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      realizarBusca(query, null);
    }
    setMostrarFiltros(false);
  };

  const limparFiltros = () => {
    setFiltrosAvancados({
      especie: '',
      porte: '',
      localizacao: '',
      categoria: ''
    });
    
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      navigate(`/busca?q=${encodeURIComponent(query)}&filtro=todos`);
    }
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
            <h1 className="search-title">Resultados da Busca</h1>
            <button 
              className="toggle-filtros-btn"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              <FaFilter />
              <span>Filtros Avançados</span>
            </button>
          </div>
          
          <div className="search-bar-container">
            <BuscaFeed />
          </div>
        </div>

        <div className="search-content">
          {mostrarFiltros && (
            <div className="filtros-avancados">
              <div className="filtros-header">
                <h3>Filtros Avançados</h3>
                <button 
                  className="fechar-filtros"
                  onClick={() => setMostrarFiltros(false)}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="filtros-grid">
                <div className="filtro-group">
                  <label>Categoria</label>
                  <select 
                    value={filtrosAvancados.categoria}
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
                    value={filtrosAvancados.especie}
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
                    value={filtrosAvancados.porte}
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
                    value={filtrosAvancados.localizacao}
                    onChange={(e) => handleFiltroChange('localizacao', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="filtros-actions">
                <button className="aplicar-filtros" onClick={aplicarFiltros}>
                  Aplicar Filtros
                </button>
                <button className="limpar-filtros" onClick={limparFiltros}>
                  Limpar Tudo
                </button>
              </div>
            </div>
          )}

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
                  <p>Nenhum animal encontrado com os critérios de busca.</p>
                  <button onClick={limparFiltros}>
                    Limpar filtros e ver todos
                  </button>
                </div>
              ) : (
                <>
                  <p className="contador-resultados">
                    {resultados.length} animal{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
                  </p>
                  
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
    </div>
  );
};

export default ResultadosBusca;