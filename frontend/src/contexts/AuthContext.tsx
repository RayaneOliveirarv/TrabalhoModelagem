// ============================================
// NOVO: Context de Autenticação Global
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

// NOVO: Interface dos dados disponíveis no contexto
interface AuthContextData {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// NOVO: Criação do contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

// NOVO: Provider que envolve a aplicação
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // NOVO: Carrega o usuário do localStorage ao iniciar (persistência)
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

  // NOVO: Função de login - chama API e salva no localStorage
  const login = async (email: string, senha: string) => {
    try {
      const response = await api.login(email, senha);
      
      // NOVO: Valida se a conta está ativa antes de permitir login
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

  // NOVO: Função de logout - remove dados do localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('@olpet:user');
  };

  // NOVO: Atualiza dados do usuário (útil para edição de perfil)
  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      console.log("user atualizado: ",updatedUser)
      localStorage.setItem('@olpet:user', JSON.stringify(updatedUser));
    }

    try{
      await api.atualizarPerfil(user!.id, user!.tipo, {nome: user?.nome ?? "", email:user?.email ?? ""});
    }
    catch(err)
    {
      throw err;
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
// NOVO: Hook customizado para usar o contexto de autenticação
};

export const getUserData = async() => {
  const id = localStorage.getItem('@olpet:user');
  const item = id ? JSON.parse(id) : null;

  console.log("ID usuario busca",item.id)
  const response = await api.getDadosUsuario(item.id);

  console.log("resposta que vai pro front: ", response)

  const dados_res = {
      nome: item.nome,
      email: item.email,
      tipo: response.dados_usr[0].tipo,
      status_conta: response.dados_usr[0].status_conta,
  }

  console.log(dados_res)

  localStorage.setItem("user_data", JSON.stringify(dados_res));
}
export const listarUsuarios = async() => {
  const response = await api.listarUsuarios();
  return response
}
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
