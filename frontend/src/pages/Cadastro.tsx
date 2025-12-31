import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Cadastro/cadastro.css';

const Cadastro: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/alterarCadastro');
  };

  return (
    <div className="login-bg">
      <div style={{ height: '40px' }}></div>
      <div className="login-header">
        <div className="login-logo">LOGO</div>
        <h2 className="login-title">OLPET</h2>
        <p className="login-subtitle">Encontre animais perdidos e ajude os sem lar</p>
        <div className="login-tabs">
          <button className={''} onClick={() => navigate('/')}>Entrar</button>
          <button className={'active'}>Registrar</button>
        </div>
      </div>
      <div className="login-card">
        <h3>CADASTRO</h3>
        <p className="login-card-subtitle">Junte-se a nós e ajude a salvar vidas</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="nome">Nome Completo</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <label htmlFor="senha">Senha</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="senha"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
            <span
              className="input-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            >
              👁️
            </span>
          </div>
          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <div className="input-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmarSenha"
              name="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              required
            />
            <span
              className="input-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ cursor: 'pointer' }}
            >
              👁️
            </span>
          </div>
          <button type="submit" className="login-btn" style={{cursor: 'pointer', opacity: 1, color: '#00838f'}}>
            REGISTRAR
          </button>
        </form>
        <div className="login-footer">
          <span>Já tem conta? <a href="#" onClick={() => navigate('/')}>Entrar</a></span>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
