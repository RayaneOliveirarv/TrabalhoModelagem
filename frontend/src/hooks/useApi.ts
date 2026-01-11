// ============================================
// NOVO: Hook customizado para chamadas à API
// Simplifica gerenciamento de loading, data e error
// ============================================

import { useState } from 'react';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// NOVO: Hook que encapsula lógica comum de requisições
export const useApi = <T = any,>(apiFunction: (...args: any[]) => Promise<T>, options?: UseApiOptions) => {
  // NOVO: Estados para gerenciar requisição
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NOVO: Função que executa a chamada à API
  const execute = async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao processar requisição';
      setError(errorMessage);
      
      if (options?.onError) {
        options.onError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useApi;
