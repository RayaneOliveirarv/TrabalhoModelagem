import React, { useState } from 'react';
import '../styles/NavbarFeed/NavbarFeed.css';

const options = [
  'Todos',
  'Perdidos',
  'Encontrados',
  'Adoção'
];

const NavbarFeed: React.FC = () => {
  const [active, setActive] = useState(0);
  return (
    <nav className="navbar-feed">
      {options.map((opt, idx) => (
        <button
          key={opt}
          className={`navbar-feed-item${active === idx ? ' active' : ''}`}
          onClick={() => setActive(idx)}
        >
          {opt.toUpperCase()}
        </button>
      ))}
    </nav>
  );
};

export default NavbarFeed;
