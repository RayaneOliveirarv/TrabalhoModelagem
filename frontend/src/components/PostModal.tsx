import React, { useState, useEffect } from 'react';
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

  const [cidades, setCidades] = useState<string[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);

  useEffect(() => {
    if (isOpen && cidades.length === 0) {
      setCarregandoCidades(true);
      fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome")
        .then(response => response.json())
        .then(data => {
          const formatado = data.map((mun: any) => 
            `${mun.nome} - ${mun.microrregiao?.mesorregiao?.UF?.sigla || 'UF'}`
          );
          setCidades(formatado);
        })
        .catch(err => console.error("Erro ao carregar cidades:", err))
        .finally(() => setCarregandoCidades(false));
    }
  }, [isOpen, cidades.length]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      nome, descricao, categoria, especie, porte, idade, localizacao,
      data_desaparecimento: dataDesaparecimento,
      ultima_localizacao: ultimaLocalizacao,
      imagem 
    });
    
    // Resetar campos
    setNome(''); setDescricao(''); setCategoria('Adocao'); setEspecie('Cao');
    setPorte('Médio'); setIdade(''); setLocalizacao('');
    setDataDesaparecimento(''); setUltimaLocalizacao(''); setImagem(null);
    onClose();
  };

  return (
    <div className="post-modal-overlay" onClick={onClose}>
      <div className="post-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Novo Post de Animal</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome do animal:
            <input 
              type="text"
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              required 
              placeholder="Digite o nome do animal"
            />
          </label>
          
          <label>Tipo do animal:
            <select value={especie} onChange={e => setEspecie(e.target.value)} required>
              <option value="Cao">Cão</option>
              <option value="Gato">Gato</option>
              <option value="Felino">Felino</option>
              <option value="Ave">Ave</option>
              <option value="Outro">Outro</option>
            </select>
          </label>

          <label>Estado do animal:
            <select value={categoria} onChange={e => setCategoria(e.target.value)} required>
              <option value="Adocao">Adoção</option>
              <option value="Perdido">Perdido</option>
              <option value="Encontrado">Encontrado</option>
            </select>
          </label>

          <label>Localização:
            <select 
              value={localizacao} 
              onChange={e => setLocalizacao(e.target.value)} 
              required
              disabled={carregandoCidades}
            >
              <option value="">
                {carregandoCidades ? 'Carregando cidades...' : 'Selecione uma cidade'}
              </option>
              {cidades.map((cidade, index) => (
                <option key={index} value={cidade}>{cidade}</option>
              ))}
            </select>
          </label>

          {categoria === 'Perdido' && (
            <div className="perdido-fields">
              <label>Data do Desaparecimento:
                <input 
                  type="date" 
                  value={dataDesaparecimento} 
                  onChange={e => setDataDesaparecimento(e.target.value)} 
                  required 
                />
              </label>
              <label>Última Localização Vista:
                <input 
                  type="text"
                  value={ultimaLocalizacao} 
                  onChange={e => setUltimaLocalizacao(e.target.value)} 
                  required 
                  placeholder="Ex: Perto do mercado X" 
                />
              </label>
            </div>
          )}

          <label>Descrição:
            <textarea 
              value={descricao} 
              onChange={e => setDescricao(e.target.value)} 
              required 
              rows={4}
              placeholder="Descreva o animal..."
            />
          </label>

          <label>Upload img:
            <input 
              type="file" 
              accept="image/*" 
              onChange={e => setImagem(e.target.files?.[0] || null)} 
            />
            {imagem && <span className="file-name">{imagem.name}</span>}
          </label>

          <button type="submit" className="submit-btn">Criar post</button>
        </form>
      </div>
    </div>
  );
};

export default PostModal;