import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { validateEmail, validatePassword, validateConfirmPassword, validateRequired } from '../utils/validation';
import '../styles/Cadastro/cadastro.css';

const Cadastro: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    //  Campo tipo para selecionar perfil (ADOTANTE/PROTETOR/ONG)
    tipo: 'ADOTANTE' as 'ADOTANTE' | 'PROTETOR' | 'ONG',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Estado para erros de validação por campo
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Estado de loading
  const [loading, setLoading] = useState(false);
  // Mensagem de sucesso após cadastro
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Função de submit com validações completas e chamada à API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    //  Validações de todos os campos
    const newErrors: Record<string, string> = {};
    
    const nomeError = validateRequired(form.nome);
    if (nomeError) newErrors.nome = nomeError;
    
    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;
    
    const senhaError = validatePassword(form.senha);
    if (senhaError) newErrors.senha = senhaError;
    
    const confirmarSenhaError = validateConfirmPassword(form.senha, form.confirmarSenha);
    if (confirmarSenhaError) newErrors.confirmarSenha = confirmarSenhaError;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);
    setSuccessMessage('');
    
    try {
      // Chama API para cadastrar usuário no backend
      await api.cadastrarUsuario({
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        tipo: form.tipo,
      });
      
      // Exibe mensagem de sucesso e redireciona
      setSuccessMessage('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      // Captura erros da API (ex: email duplicado)
      setErrors({ general: error.message || 'Erro ao realizar cadastro. Tente novamente.' });
    } finally {
      setLoading(false);
    }
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
          {errors.general && (
            <div style={{ color: '#d32f2f', marginBottom: '16px', padding: '12px', backgroundColor: '#ffebee', borderRadius: '4px', fontSize: '14px' }}>
              {errors.general}
            </div>
          )}
          
          {successMessage && (
            <div style={{ color: '#2e7d32', marginBottom: '16px', padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '4px', fontSize: '14px' }}>
              {successMessage}
            </div>
          )}
          
          <label htmlFor="tipo">Tipo de Perfil</label>
          <div className="input-wrapper">
            <select
              id="tipo"
              name="tipo"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value as any })}
              disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
            >
              <option value="ADOTANTE">Adotante</option>
              <option value="PROTETOR">Protetor Individual</option>
              <option value="ONG">ONG</option>
            </select>
          </div>
          
          <label htmlFor="nome">{form.tipo === 'ONG' ? 'Nome da Instituição' : 'Nome Completo'}</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              disabled={loading}
              style={{ borderColor: errors.nome ? '#d32f2f' : undefined }}
            />
          </div>
          {errors.nome && <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '-8px', display: 'block', marginBottom: '8px' }}>{errors.nome}</span>}
          
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              style={{ borderColor: errors.email ? '#d32f2f' : undefined }}
            />
          </div>
          {errors.email && <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '-8px', display: 'block', marginBottom: '8px' }}>{errors.email}</span>}
          
          <label htmlFor="senha">Senha</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="senha"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              disabled={loading}
              style={{ borderColor: errors.senha ? '#d32f2f' : undefined }}
            />
            <span
              className="input-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            >
              👁️
            </span>
          </div>
          {errors.senha && <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '-8px', display: 'block', marginBottom: '8px' }}>{errors.senha}</span>}
          
          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <div className="input-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmarSenha"
              name="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              disabled={loading}
              style={{ borderColor: errors.confirmarSenha ? '#d32f2f' : undefined }}
            />
            <span
              className="input-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ cursor: 'pointer' }}
            >
              👁️
            </span>
          </div>
          {errors.confirmarSenha && <span style={{ color: '#d32f2f', fontSize: '12px', marginTop: '-8px', display: 'block', marginBottom: '8px' }}>{errors.confirmarSenha}</span>}
          
          <button type="submit" className="login-btn" disabled={loading} style={{cursor: 'pointer', opacity: loading ? 0.6 : 1, color: '#00838f'}}>
            {loading ? 'CADASTRANDO...' : 'REGISTRAR'}
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
