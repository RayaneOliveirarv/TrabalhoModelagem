import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// NOVO: Import do hook de autenticação para verificar se está logado
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import AlterarCadastro from '../pages/AlterarCadastro';
import AlterarContaONG from '../pages/AlterarContaONG';
import Feed from '../pages/Feed';
import Configuracoes from '../pages/Configuracoes';
import Perfil_page from '../pages/Perfil_page';
import Adocao from '../pages/Adocao';
import AdminPage from '../pages/AdminPage';

// NOVO: Import do componente de rota protegida
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes: React.FC = () => {
  // NOVO: Verifica se usuário está autenticado
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* NOVO: Redireciona para feed se já estiver logado */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/feed" replace /> : <Login />} 
        />
        <Route path="/cadastro" element={<Cadastro />} />
        {/* NOVO: Rota protegida - apenas usuários autenticados */}
        <Route 
          path="/alterarCadastro" 
          element={
            <ProtectedRoute>
              <AlterarCadastro />
            </ProtectedRoute>
          } 
        />
        {/* NOVO: Rota protegida - apenas ONG e PROTETOR podem acessar */}
        <Route 
          path="/alterar-conta-ong" 
          element={
            <ProtectedRoute requiredTypes={['ONG', 'PROTETOR']}>
              <AlterarContaONG />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/feed" 
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/configuracoes" 
          element={
            <ProtectedRoute>
              <Configuracoes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <Perfil_page />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/adocao" 
          element={
            <ProtectedRoute>
              <Adocao />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
