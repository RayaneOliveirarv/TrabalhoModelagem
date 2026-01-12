import React from 'react';
import '../styles/NavbarFeed/NavbarFeed.css';

// Definição das opções para garantir que o texto coincida com o que o banco espera
const options = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Perdidos', value: 'PERDIDO' },
  { label: 'Encontrados', value: 'ENCONTRADO' },
  { label: 'Adoção', value: 'ADOCAO' }
];

// Interface para definir as propriedades (props) que o componente recebe
interface NavbarFeedProps {
  categoriaAtiva: string;
  onFilterChange: (categoria: string) => void;
}

const NavbarFeed: React.FC<NavbarFeedProps> = ({ categoriaAtiva, onFilterChange }) => {
  return (
    <nav className="navbar-feed">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`navbar-feed-item${categoriaAtiva === opt.value ? ' active' : ''}`}
          // Quando clica, chama a função do Feed passando o valor
          onClick={() => onFilterChange(opt.value)}
        >
          {opt.label.toUpperCase()}
        </button>
      ))}
    </nav>
  );
};

export default NavbarFeed;