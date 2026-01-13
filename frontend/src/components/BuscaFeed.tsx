import React from 'react';
import '../styles/BuscaFeed/BuscaFeed.css';
import { FaSearch } from 'react-icons/fa';

// Definimos o que o componente espera receber
interface BuscaFeedProps {
  onSearch: (termo: string) => void;
}

const BuscaFeed: React.FC<BuscaFeedProps> = ({ onSearch }) => {
  return (
    <div className="busca-feed-container">
      <input
        className="busca-feed-input"
        id="input-busca" // ID para pegarmos o valor depois
        type="text"
        placeholder="Busca por especie, Localização"
      />
      
      <button style={{border: 'none', background: 'transparent', display: 'flex'}} onClick={() => {
        const valor = (document.getElementById('input-busca') as HTMLInputElement).value;
        onSearch(valor);
      }}>
        <FaSearch className='navbar-icon' ></FaSearch>
      </button>
    </div>
  );
};

export default BuscaFeed;