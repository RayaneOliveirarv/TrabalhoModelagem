import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import '../styles/Login/Login.css'

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  //  Estado para armazenar erros de validação específicos
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  // Estado de loading para mostrar feedback durante requisição
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Hook de autenticação que conecta com a API
  const { login } = useAuth();

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
        {/* Formulário com validação em tempo real e integração com API */}
        <form onSubmit={async (e) => {
          e.preventDefault();
          
          //  Validações usando funções customizadas
          const emailError = validateEmail(email);
          const passwordError = validatePassword(password);
          
          if (emailError || passwordError) {
            setErrors({ email: emailError || undefined, password: passwordError || undefined });
            return;
          }
          
          setErrors({});
          setLoading(true);
          
          try {
            // Chama API de login através do AuthContext
            await login(email, password);
            navigate('/feed');
          } catch (error: any) {
            //  Captura e exibe erro da API
            setErrors({ general: error.message || 'Erro ao fazer login. Verifique suas credenciais.' });
          } finally {
            setLoading(false);
          }
        }}>
          {/* Exibe erro geral retornado pela API (ex: conta bloqueada) */}
          {errors.general && (
            <div style={{ color: '#d32f2f', marginBottom: '16px', padding: '12px', backgroundColor: '#ffebee', borderRadius: '4px', fontSize: '14px' }}>
              {errors.general}
            </div>
          )}
          
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              autoComplete="username"
              disabled={loading}
              style={{ borderColor: errors.email ? '#d32f2f' : undefined }}
            />
          </div>
          {errors.email && <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '-8px', display: 'block', marginBottom: '8px' }}>{errors.email}</span>}
          
          <label htmlFor="password">Senha</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              autoComplete="current-password"
              disabled={loading}
              style={{ borderColor: errors.password ? '#d32f2f' : undefined }}
            />
            <span
              className="input-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            >
              👁️
            </span>
          </div>
          {errors.password && <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '-8px', display: 'block', marginBottom: '8px' }}>{errors.password}</span>}
          
          <button type="submit" className="login-btn" disabled={!(email && password) || loading}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
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

