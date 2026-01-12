import React from 'react';
import '../styles/BuscaFeed/BuscaFeed.css';

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
      
      <button onClick={() => {
        const valor = (document.getElementById('input-busca') as HTMLInputElement).value;
        onSearch(valor);
      }}>
        🔍
      </button>
    </div>
  );
};

export default BuscaFeed;