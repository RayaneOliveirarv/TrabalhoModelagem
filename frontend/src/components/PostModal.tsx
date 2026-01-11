import React, { useState } from 'react';
import './PostModal.css';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostData) => void;
}

export interface PostData {
  nome: string;
  descricao: string;
  categoria: string;
  especie: string;
  porte: string;
  idade?: string;
  localizacao: string;
  data_desaparecimento?: string;
  ultima_localizacao?: string;
  imagem?: File | null;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('Adocao');
  const [especie, setEspecie] = useState('Cao');
  const [porte, setPorte] = useState('Médio');
  const [idade, setIdade] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [dataDesaparecimento, setDataDesaparecimento] = useState('');
  const [ultimaLocalizacao, setUltimaLocalizacao] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      nome, 
      descricao, 
      categoria, 
      especie, 
      porte, 
      idade, 
      localizacao,
      data_desaparecimento: dataDesaparecimento,
      ultima_localizacao: ultimaLocalizacao,
      imagem 
    });
    setNome('');
    setDescricao('');
    setCategoria('Adocao');
    setEspecie('Cao');
    setPorte('Médio');
    setIdade('');
    setLocalizacao('');
    setDataDesaparecimento('');
    setUltimaLocalizacao('');
    setImagem(null);
    onClose();
  };

  return (
    <div className="post-modal-overlay" onClick={onClose}>
      <div className="post-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Novo Post de Animal</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome do animal
            <input value={nome} onChange={e => setNome(e.target.value)} required />
          </label>
          <label>Categoria
            <select value={categoria} onChange={e => setCategoria(e.target.value)} required>
              <option value="Adocao">Adoção</option>
              <option value="Perdido">Perdido</option>
              <option value="Encontrado">Encontrado</option>
            </select>
          </label>
          <label>Espécie
            <select value={especie} onChange={e => setEspecie(e.target.value)} required>
              <option value="Cao">Cão</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Outro">Outro</option>
            </select>
          </label>
          <label>Porte
            <select value={porte} onChange={e => setPorte(e.target.value)} required>
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
              <option value="Não informado">Não informado</option>
            </select>
          </label>
          <label>Idade (opcional)
            <input value={idade} onChange={e => setIdade(e.target.value)} placeholder="Ex: 2 anos" />
          </label>
          <label>Localização
            <input value={localizacao} onChange={e => setLocalizacao(e.target.value)} required placeholder="Ex: São Paulo, SP" />
          </label>
          {categoria === 'Perdido' && (
            <>
              <label>Data do Desaparecimento
                <input type="date" value={dataDesaparecimento} onChange={e => setDataDesaparecimento(e.target.value)} required />
              </label>
              <label>Última Localização Vista
                <input value={ultimaLocalizacao} onChange={e => setUltimaLocalizacao(e.target.value)} required placeholder="Ex: Praça Central, perto do mercado" />
              </label>
            </>
          )}
          <label>Descrição
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} required rows={4} />
          </label>
          <label>Imagem
            <input type="file" accept="image/*" onChange={e => setImagem(e.target.files?.[0] || null)} />
          </label>
          <button type="submit" className="submit-btn">Postar</button>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
