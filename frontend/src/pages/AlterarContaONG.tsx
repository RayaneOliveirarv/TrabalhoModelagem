import React from 'react';
import '../styles/AlterarContaONG/AlterarContaONG.css';

const AlterarContaONG: React.FC = () => {
  return (
    <div className="alterar-cadastro-bg">
      <div className="alterar-cadastro-center">
        <div className="alterar-cadastro-card">
          <h2 className="alterar-cadastro-title">Alterar a conta para uma conta de ONG</h2>
          <form>
            <label>Nome fantasia</label>
            <input type="text" className="input-ong" />
            <div className="input-row">
              <div>
                <label>CPF/CNPJ</label>
                <input type="text" className="input-ong" />
              </div>
              <div>
                <label>Nome responsável</label>
                <input type="text" className="input-ong" />
              </div>
            </div>
            <div className="input-row">
              <div>
                <label>Email</label>
                <input type="email" className="input-ong" />
              </div>
              <div>
                <label>Contato</label>
                <input type="text" className="input-ong" />
              </div>
            </div>
            <div className="input-row">
              <div>
                <label>Endereço</label>
                <input type="text" className="input-ong" />
              </div>
              <div>
                <label>CEP</label>
                <input type="text" className="input-ong" />
              </div>
            </div>
            <label>Motivação da organização</label>
            <textarea className="input-ong textarea-ong" rows={4} />
            <div className="form-footer">
              <button type="submit" className="alterar-cadastro-btn">Enviar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlterarContaONG;
