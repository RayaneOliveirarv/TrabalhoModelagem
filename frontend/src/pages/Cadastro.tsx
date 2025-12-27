import React, { useState } from 'react';
import '../styles/Cadastro/Cadastro.css';
import { useNavigate } from 'react-router-dom';

const Cadastro: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Cadastro realizado!');
  };

  return (
    <div className="cadastro-bg">
      <div className="cadastro-container">
        <div className="cadastro-logo">LOGO</div>
        <h2 className="cadastro-title">OLPET</h2>
        <p className="cadastro-subtitle">Encontre animais perdidos e ajude os sem lar</p>
        <div className="cadastro-tabs">
          <button className={""} onClick={() => navigate('/')}>Entrar</button>
          <button className={"active"}>Registrar</button>
        </div>
        <div className="cadastro-card">
          <form onSubmit={handleSubmit} className="cadastro-form">
            <h3 className="cadastro-form-title">Criar conta</h3>
            <label>Nome Completo</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
            <label>Confirmar Senha</label>
            <input
              type="password"
              name="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              required
            />
            <button type="submit" className="cadastro-btn">REGISTRAR</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
