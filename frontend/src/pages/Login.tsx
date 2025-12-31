import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login/Login.css'

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="login-bg">
      <div className="login-header">
        <div className="login-logo">LOGO</div>
        <h2 className="login-title">OLPET</h2>
        <p className="login-subtitle">Encontre animais perdidos e ajude os sem lar</p>
        <div className="login-tabs">
          <button
            className={'active'}
            onClick={() => navigate('/')}
          >
            Entrar
          </button>
          <button
            className={''}
            onClick={() => navigate('/cadastro')}
          >
            Registrar
          </button>
        </div>
      </div>
      <div className="login-card">
        <h3>LOGIN</h3>
        <p className="login-card-subtitle">Junte-se a nós e ajude a salvar vidas</p>
        <form onSubmit={e => { e.preventDefault(); navigate('/feed'); }}>
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
            />
            <span className="input-icon">👁️</span>
          </div>
          <label htmlFor="password">Senha</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <span
              className="input-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            >
              👁️
            </span>
          </div>
          <button type="submit" className="login-btn" disabled={!(email && password)}>
            ENTRAR
          </button>
        </form>
        <div className="login-footer">
          <a href="#" className="forgot-password">Esqueci a minha senha</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

