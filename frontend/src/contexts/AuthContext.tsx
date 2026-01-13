// ============================================
// Context de Autenticação Global
// Gerencia estado do usuário logado em toda aplicação
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

// NOVO: Interface do usuário logado
interface User {
  id: number;
  email: string;
  tipo: 'ADOTANTE' | 'PROTETOR' | 'ONG' | 'ADMIN';
  status_conta: string;
  nome?: string;
}

//  Interface dos dados disponíveis no contexto
interface AuthContextData {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

//  Criação do contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

//  Provider que envolve a aplicação
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  //  Carrega o usuário do localStorage ao iniciar (persistência)
  useEffect(() => {
    const storedUser = localStorage.getItem('@olpet:user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('@olpet:user');
      }
    }
    
    setLoading(false);
  }, []);

  //  Função de login - chama API e salva no localStorage
  const login = async (email: string, senha: string) => {
    try {
      const response = await api.login(email, senha);
      
      //  Valida se a conta está ativa antes de permitir login
      if (response.status_conta.toLowerCase() === 'bloqueado') {
        throw new Error('Sua conta está bloqueada. Entre em contato com o administrador.');
      }

      if (response.status_conta.toLowerCase() === 'pendente') {
        throw new Error('Sua conta ainda está pendente de aprovação pelo administrador.');
      }

      const userData: User = {
        id: response.id,
        email: response.email,
        tipo: response.tipo as User['tipo'],
        status_conta: response.status_conta,
      };

      setUser(userData);
      localStorage.setItem('@olpet:user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  //  Função de logout - remove dados do localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('@olpet:user');
  };

  // Atualiza dados do usuário (útil para edição de perfil)
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('@olpet:user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
//  Hook customizado para usar o contexto de autenticação
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
