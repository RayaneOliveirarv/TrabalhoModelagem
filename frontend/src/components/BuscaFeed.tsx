import React from 'react';
import '../styles/BuscaFeed/BuscaFeed.css';
//import { FaSearch } from 'react-icons/fa';

const BuscaFeed: React.FC = () => {
  return (
    <div className="busca-feed-container">
      {/*<FaSearch className="busca-feed-icon" />*/}
      <input
        className="busca-feed-input"
        type="text"
        placeholder="Busca por especie, Localização"
      />
    </div>
  );
};

export default BuscaFeed;
