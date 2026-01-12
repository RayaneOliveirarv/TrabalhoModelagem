import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // NOVO: Import do componente Select
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

// Interface para o formato exigido pelo react-select
interface CidadeOption {
  value: string;
  label: string;
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

  // ESTADOS PARA AS CIDADES
  const [optionsCidades, setOptionsCidades] = useState<CidadeOption[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);

  useEffect(() => {
    if (isOpen && optionsCidades.length === 0) {
      setCarregandoCidades(true);
      fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome")
        .then(response => response.json())
        .then(data => {
          const formatado = data.map((mun: any) => ({
            value: `${mun.nome}, ${mun.microrregiao?.mesorregiao?.UF?.sigla || 'UF'}`,
            label: `${mun.nome}, ${mun.microrregiao?.mesorregiao?.UF?.sigla || 'UF'}`
          }));
          setOptionsCidades(formatado);
        })
        .catch(err => console.error("Erro ao carregar cidades:", err))
        .finally(() => setCarregandoCidades(false));
    }
  }, [isOpen, optionsCidades.length]);

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

  // Estilização customizada para o react-select combinar com seu layout
  const customStyles = {
    control: (base: any) => ({
      ...base,
      borderRadius: '8px',
      borderColor: '#ddd',
      marginTop: '5px',
      minHeight: '38px',
    })
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
          
          <div className="row">
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
          </div>

          <label>Localização
            <Select
              options={optionsCidades}
              isLoading={carregandoCidades}
              placeholder="Digite o nome da cidade..."
              loadingMessage={() => "Carregando cidades..."}
              noOptionsMessage={() => "Nenhuma cidade encontrada"}
              onChange={(option) => setLocalizacao(option?.value || '')}
              styles={customStyles}
              isSearchable
              required
            />
          </label>

          {categoria === 'Perdido' && (
            <div className="perdido-fields">
              <label>Data do Desaparecimento
                <input type="date" value={dataDesaparecimento} onChange={e => setDataDesaparecimento(e.target.value)} required />
              </label>
              <label>Última Localização Vista
                <input value={ultimaLocalizacao} onChange={e => setUltimaLocalizacao(e.target.value)} required placeholder="Ex: Perto do mercado X" />
              </label>
            </div>
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