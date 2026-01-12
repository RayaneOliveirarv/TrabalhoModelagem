import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import '../styles/AlterarCadastro/AlterarCadastro.css';

const AlterarCadastro: React.FC = () => {
  const navigate = useNavigate();
  // Acessa dados do usuário e função de atualização
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePromocao = async (promover: boolean) => {
    if (!promover) {
      navigate('/feed');
      return;
    }

    if (!user) return;

    if (user.tipo === 'ONG' || user.tipo === 'PROTETOR') {
      setMessage('Sua conta já é de ONG ou Protetor!');
      setTimeout(() => navigate('/feed'), 2000);
      return;
    }

    setLoading(true);
    try {
      // Por enquanto, vamos apenas redirecionar para a página de alteração
      navigate('/alterar-conta-ong');
    } catch (error: any) {
      setMessage('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
          <h3>Promover sua conta para o perfil de ONG ou Protetor?</h3>
          
          {message && (
            <div style={{ 
              padding: '12px', 
              marginBottom: '16px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '4px',
              color: '#1976d2',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}
          
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', textAlign: 'center' }}>
            Tipo atual: <strong>{user?.tipo}</strong>
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 40, width: '100%' }}>
            <button 
              className="alterar-cadastro-btn" 
              onClick={() => handlePromocao(true)}
              disabled={loading}
            >
              {loading ? 'AGUARDE...' : 'SIM'}
            </button>
            <button 
              className="alterar-cadastro-btn" 
              onClick={() => handlePromocao(false)}
              disabled={loading}
            >
              NÃO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlterarCadastro;
