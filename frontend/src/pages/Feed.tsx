import React, { useEffect, useState } from 'react';
// Import do hook de autenticação
import { useAuth } from '../contexts/AuthContext';
// Import do serviço de API
import api from '../services/api';
import NavbarPrincipal from '../components/NavbarPrincipal';
import BuscaFeed from '../components/BuscaFeed';
import NavbarFeed from '../components/NavbarFeed';
import NovoPostButton from '../components/NovoPostButton';
import PostModal from '../components/PostModal';
import type { PostData } from '../components/PostModal';
import { FaHeart, FaComment, FaStar, FaMapMarkerAlt, FaTrash } from 'react-icons/fa';
import '../styles/Feed/Feed.css';

const Feed: React.FC = () => {
  const { user } = useAuth();
  const [animais, setAnimais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('TODOS');
  
  // ESTADOS PARA O MODAL E POSTAGEM
  const [modalOpen, setModalOpen] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState('');

  // Estado para armazenar o termo de busca
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    const carregarAnimais = async () => {
      try {
        const data = await api.listarAnimais();
        setAnimais(data);
      } catch (err: any) {
        setError('Erro ao carregar animais: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    carregarAnimais();
  }, []);

  // Função passada no NavbarFeed
const handleFilterCategory = (categoria: string) => {
  setCategoriaAtiva(categoria);
};

  // Função Passada no BuscaFeed
  const handleSearch = (termo: string) => {
    setTermoBusca(termo.toLowerCase());
  };

  // Filtragem dos animais baseada no termo de busca
  const animaisFiltrados = animais.filter((animal) => {
  const matchesBusca = 
    animal.nome?.toLowerCase().includes(termoBusca) ||
    animal.especie?.toLowerCase().includes(termoBusca) ||
    animal.localizacao?.toLowerCase().includes(termoBusca);

  // Lógica da Categoria
  const matchesCategoria = 
    categoriaAtiva === 'TODOS' || 
    animal.categoria?.toUpperCase() === categoriaAtiva;

  return matchesBusca && matchesCategoria;
});

  // Função para abrir o modal
  const handleOpenModal = () => {
    setModalOpen(true);
    setPostError('');
    setPostSuccess('');
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Função para enviar o novo post
  const handlePostSubmit = async (data: PostData) => {
    setPostLoading(true);
    setPostError('');
    setPostSuccess('');
    try {
      if (!user?.id) {
        setPostError('Você precisa estar logado para cadastrar um animal.');
        setPostLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('nome', data.nome);
      formData.append('descricao', data.descricao);
      formData.append('categoria', data.categoria);
      formData.append('especie', data.especie);
      formData.append('porte', data.porte);
      formData.append('localizacao', data.localizacao);
      if (data.idade) formData.append('idade', data.idade);
      
      if (data.categoria === 'Perdido') {
        if (data.data_desaparecimento) formData.append('data_desaparecimento', data.data_desaparecimento);
        if (data.ultima_localizacao) formData.append('ultima_localizacao', data.ultima_localizacao);
      }
      
      if (user.tipo === 'ONG') {
        formData.append('ong_id', user.id.toString());
      } else {
        formData.append('protetor_id', user.id.toString());
      }
      
      if (data.imagem) formData.append('foto', data.imagem);
      
      await api.cadastrarAnimal(formData);
      setPostSuccess('Animal cadastrado com sucesso!');
      
      const novosAnimais = await api.listarAnimais();
      setAnimais(novosAnimais);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      handleCloseModal(); // Fecha o modal após o sucesso
    } catch (err: any) {
      setPostError('Erro ao cadastrar animal: ' + (err.message || ''));
    } finally {
      setPostLoading(false);
    }
  };

  // Função para excluir animal
  const handleDeleteAnimal = async (animalId: number) => {
    if (!user?.id) {
      setError('Você precisa estar logado para excluir um animal.');
      return;
    }

    if (!window.confirm('Tem certeza que deseja excluir este animal?')) {
      return;
    }

    try {
      await api.deletarAnimal(animalId, user.id);
      setPostSuccess('Animal excluído com sucesso!');
      const novosAnimais = await api.listarAnimais();
      setAnimais(novosAnimais);
    } catch (err: any) {
      setError('Erro ao excluir animal: ' + (err.message || ''));
    }
  };

  return (
    <div className="feed-page">
      <NavbarPrincipal />
      <div className="feed-container">
        <div className="feed-top-bar">
          {/* Funções e busca para componentes */}
          <BuscaFeed onSearch={handleSearch} />
          <NovoPostButton onClick={handleOpenModal} />
        </div>
        <NavbarFeed categoriaAtiva={categoriaAtiva} onFilterChange={handleFilterCategory} />
        
        <PostModal isOpen={modalOpen} onClose={handleCloseModal} onSubmit={handlePostSubmit} />
        
        {postLoading && <div className="feed-message">Enviando post...</div>}
        {postError && <div className="feed-error">{postError}</div>}
        {postSuccess && <div className="feed-success">{postSuccess}</div>}
        
        {loading && <div className="feed-message">Carregando animais...</div>}
        {error && <div className="feed-error">{error}</div>}
        
        {!loading && !error && animaisFiltrados.length === 0 && (
          <div className="feed-message">
            {termoBusca ? `Nenhum resultado para "${termoBusca}"` : "Nenhum animal cadastrado."}
          </div>
        )}

        <div className="feed-cards-grid">
          {/* Usando a lista FILTRADA para renderizar os cards */}
          {animaisFiltrados.map((animal) => (
            <div key={animal.id} className="feed-card">
              <div className="feed-card-header">
                <div className="feed-card-user-info">
                  <div className="feed-card-avatar">
                    {animal.ong_nome?.[0]?.toUpperCase() || animal.protetor_nome?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="feed-card-username">
                    {animal.ong_nome || animal.protetor_nome || 'Usuário'}
                  </span>
                </div>
                <span className={`feed-card-badge ${animal.categoria === 'Perdido' ? 'perdido' : 'adocao'}`}>
                  {animal.categoria === 'Perdido' ? 'PERDIDO' : animal.categoria === 'Adocao' ? 'ADOÇÃO' : 'ENCONTRADO'}
                </span>
              </div>

              <div className="feed-card-image-wrapper">
                <img 
                  src={animal.foto_url ? `http://localhost:3000/${animal.foto_url}` : 'https://images.unsplash.com/photo-1558788353-f76d92427f16'} 
                  alt={animal.nome} 
                  className="feed-card-image" 
                />
              </div>

              <div className="feed-card-content">
                <h3 className="feed-card-title">{animal.nome}</h3>
                <p className="feed-card-description">{animal.descricao || 'Sem descrição disponível.'}</p>
                <div className="feed-card-location">
                  <FaMapMarkerAlt size={14} />
                  {animal.localizacao || 'Localização não informada'}
                </div>
              </div>

              <div className="feed-card-actions">
                <button className="feed-card-action-btn like">
                  <FaHeart size={16} />
                  <span>20</span>
                </button>
                <button className="feed-card-action-btn comment">
                  <FaComment size={16} />
                  <span>6</span>
                </button>
                <button className="feed-card-action-btn favorite">
                  <FaStar size={16} />
                </button>
                
                {user && (animal.ong_id === user.id || animal.protetor_id === user.id) && (
                  <button 
                    className="feed-card-action-btn delete" 
                    onClick={() => handleDeleteAnimal(animal.id)}
                    title="Excluir animal"
                  >
                    <FaTrash size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;