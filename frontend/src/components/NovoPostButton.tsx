import React from 'react';
import '../styles/NovoPostButton/NovoPostButton.css';
import { FaPlus } from 'react-icons/fa';

interface NovoPostButtonProps {
  onClick?: () => void;
}

const NovoPostButton: React.FC<NovoPostButtonProps> = ({ onClick }) => {
  return (
    <button className="novo-post-btn" onClick={onClick} type="button">
      <FaPlus className="novo-post-icon" />
      <span className="novo-post-label">Novo Post</span>
    </button>
  );
};

export default NovoPostButton;
