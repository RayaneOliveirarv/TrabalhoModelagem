import React from 'react';
import '../styles/AlterarCadastro/AlterarCadastro.css';

const AlterarCadastro: React.FC = () => {
  return (
    <div className="alterar-cadastro-bg">
      <div className="alterar-cadastro-center">
        <div className="alterar-cadastro-header">
          <div className="alterar-cadastro-logo">
            <span>LOGO</span>
          </div>
          <h2 className="alterar-cadastro-title">OLPET</h2>
          <p className="alterar-cadastro-subtitle">Encontre animais perdidos e ajude os sem lar</p>
        </div>
        <div className="alterar-cadastro-card">
          <h3>Promover sua conta para o perfil de ONG?</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40, width: '100%' }}>
            <button className="alterar-cadastro-btn">SIM</button>
            <button className="alterar-cadastro-btn">NÃO</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlterarCadastro;
