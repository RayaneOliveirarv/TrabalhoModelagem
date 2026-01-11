// ============================================
// NOVO: Serviço centralizado de API
// Gerencia todas as chamadas HTTP ao backend
// ============================================

const API_BASE_URL = 'http://localhost:3000';

interface ApiError {
  erro?: string;
  message?: string;
}

// NOVO: Classe ApiService para encapsular chamadas à API
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // NOVO: Método privado para tratar respostas HTTP e erros
  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiError;
      throw new Error(error.erro || error.message || 'Erro na requisição');
    }

    return data;
  }

  // ==================== USUÁRIOS ====================
  // NOVO: Endpoint para cadastrar novo usuário
  async cadastrarUsuario(dados: {
    nome: string;
    email: string;
    senha: string;
    tipo: 'ADOTANTE' | 'PROTETOR' | 'ONG';
    cpf?: string;
    cnpj?: string;
    razao_social?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/usuarios/cadastrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    return this.handleResponse<{ mensagem: string; usuarioId: number }>(response);
  }

  // NOVO: Endpoint para fazer login
  async login(email: string, senha: string) {
    const response = await fetch(`${this.baseUrl}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    return this.handleResponse<{
      id: number;
      email: string;
      tipo: string;
      status_conta: string;
    }>(response);
  }

  async atualizarPerfil(id: number, tipo: string, dados: any) {
    const response = await fetch(`${this.baseUrl}/usuarios/perfil/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tipo, ...dados }),
    });

    return this.handleResponse<{ mensagem: string }>(response);
  }

  async deletarConta(id: number) {
    const response = await fetch(`${this.baseUrl}/usuarios/excluir/${id}`, {
      method: 'DELETE',
    });

    return this.handleResponse<{ mensagem: string }>(response);
  }

  async enviarDocumentacao(id: number, arquivo: File) {
    const formData = new FormData();
    formData.append('documento', arquivo);

    const response = await fetch(`${this.baseUrl}/usuarios/enviar-documentacao/${id}`, {
      method: 'PUT',
      body: formData,
    });

    return this.handleResponse<{ mensagem: string; arquivo: string }>(response);
  }

  async buscarNotificacoes(id: number) {
    const response = await fetch(`${this.baseUrl}/usuarios/${id}/notificacoes`);
    return this.handleResponse<any[]>(response);
  }

  // ==================== ANIMAIS ====================
  async listarAnimais(params?: { categoria?: string; status?: string }) {
    const queryParams = new URLSearchParams(params as any).toString();
    const url = `${this.baseUrl}/animais${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url);
    return this.handleResponse<any[]>(response);
  }

  async buscarAnimal(id: number) {
    const response = await fetch(`${this.baseUrl}/animais/${id}`);
    return this.handleResponse<any>(response);
  }

  async cadastrarAnimal(dados: FormData) {
    const response = await fetch(`${this.baseUrl}/animais/cadastrar`, {
      method: 'POST',
      body: dados,
    });

    return this.handleResponse<{ mensagem: string; animalId: number }>(response);
  }

  async atualizarAnimal(id: number, dados: any) {
    const response = await fetch(`${this.baseUrl}/animais/editar/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    return this.handleResponse<{ mensagem: string }>(response);
  }

  async deletarAnimal(id: number, usuarioId?: number) {
    const response = await fetch(`${this.baseUrl}/animais/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario_id: usuarioId }),
    });

    return this.handleResponse<{ mensagem: string }>(response);
  }

  // ==================== FORMULÁRIOS ====================
  async enviarFormulario(dados: {
    adotante_id: number;
    animal_id: number;
    experiencia: string;
    ambiente: string;
    justificativa?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/formularios/enviar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    return this.handleResponse<{ mensagem: string; formularioId: number }>(response);
  }

  async aprovarFormulario(id: number) {
    const response = await fetch(`${this.baseUrl}/formularios/aprovar/${id}`, {
      method: 'PUT',
    });

    return this.handleResponse<{ mensagem: string }>(response);
  }

  async rejeitarFormulario(id: number, motivo: string) {
    const response = await fetch(`${this.baseUrl}/formularios/rejeitar/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ motivo }),
    });

    return this.handleResponse<{ mensagem: string }>(response);
  }

  // ==================== FAVORITOS ====================
  async adicionarFavorito(adotante_id: number, animal_id: number) {
    const response = await fetch(`${this.baseUrl}/animais/favoritar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adotante_id, animal_id }),
    });

    return this.handleResponse<{ mensagem: string }>(response);
  }

  async removerFavorito(adotante_id: number, animal_id: number) {
    const response = await fetch(`${this.baseUrl}/animais/desfavoritar`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adotante_id, animal_id }),
    });

    return this.handleResponse<{ mensagem: string }>(response);
  }
}

export const api = new ApiService();
export default api;
