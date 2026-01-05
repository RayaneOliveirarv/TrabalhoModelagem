import React from 'react';
import '../styles/NovoPostButton/NovoPostButton.css';
//import { FaPlus } from 'react-icons/fa';

const NovoPostButton: React.FC = () => {
  return (
    <button className="novo-post-btn">
      {/*<FaPlus className="novo-post-icon" />*/}
      <span className="novo-post-label">Novo Post</span>
    </button>
  );
};

export default NovoPostButton;
