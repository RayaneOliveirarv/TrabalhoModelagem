// ============================================
// NOVO: Componente de Rota Protegida
// Bloqueia acesso não autorizado às páginas
// ============================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  // NOVO: Array opcional de tipos de usuário permitidos
  requiredTypes?: Array<'ADOTANTE' | 'PROTETOR' | 'ONG' | 'ADMIN'>;
}

// NOVO: Componente que verifica autenticação antes de renderizar
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredTypes }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // NOVO: Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#00838f'
      }}>
        Carregando...
      </div>
    );
  }

  // NOVO: Redireciona para login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // NOVO: Verifica se o tipo de usuário tem permissão
  if (requiredTypes && user && !requiredTypes.includes(user.tipo)) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        padding: '20px'
      }}>
        <h2 style={{ color: '#d32f2f' }}>Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
        <button 
          onClick={() => window.history.back()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#00838f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Voltar
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
