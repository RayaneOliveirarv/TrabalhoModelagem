import { AnimalModel } from "../models/AnimalModel.js";

export const AnimalService = {
  // RF04 e RF05: Regras de negócio para criação de animais
  async cadastrar(dados) {
    // 1. Validação de Responsável: O animal precisa estar vinculado a uma ONG ou Protetor
    if (!dados.ong_id && !dados.protetor_id) {
      throw new Error("É necessário informar o ID da ONG ou do Protetor responsável pelo animal.");
    }

    // 2. Validação de Categoria: Garante que o valor está correto
    const categoriasValidas = ['Adocao', 'Perdido', 'Encontrado'];
    if (dados.categoria && !categoriasValidas.includes(dados.categoria)) {
      throw new Error("Categoria inválida. Opções aceitas: 'Adocao', 'Perdido' ou 'Encontrado'.");
    }

    // 3. RF06: Validação de Porte (Garante que o filtro funcione corretamente)
    const portesValidos = ['Pequeno', 'Médio', 'Grande', 'Não informado'];
    if (dados.porte && !portesValidos.includes(dados.porte)) {
      throw new Error("Porte inválido. Opções aceitas: Pequeno, Médio, Grande ou Não informado.");
    }

    // 4. Regra para Categoria 'Perdido': Exige informações específicas
    if (dados.categoria === 'Perdido') {
      if (!dados.data_desaparecimento || !dados.ultima_localizacao) {
        throw new Error("Para animais perdidos, a data do desaparecimento e a última localização são obrigatórias.");
      }
    }

    // 5. RF05: Tratamento de Foto
    // Caso não venha uma URL de foto, definimos uma imagem padrão para não quebrar o layout
    if (!dados.foto_url) {
      dados.foto_url = "uploads/animais/default-animal.png";
    }

    return AnimalModel.criar(dados);
  },

  // RF06: Listagem com filtros dinâmicos (Espécie, Porte, Cidade, etc)
  async listarComFiltros(filtros) {
    return AnimalModel.buscarAvancada(filtros);
  },

  // Busca detalhada (usada na página de perfil do animal)
  async buscarPorId(id) {
    const animal = await AnimalModel.buscarPorId(id);
    if (!animal) {
      throw new Error("Animal não encontrado.");
    }
    return animal;
  },

  // RF18: Atualização de Status (ex: quando um formulário é aprovado ou o animal é achado)
  async atualizarStatus(id, status) {
    const statusValidos = ['Disponivel', 'Em_Analise', 'Adotado', 'Perdido', 'Encontrado'];
    
    if (!statusValidos.includes(status)) {
      throw new Error("Status inválido para o sistema.");
    }

    const animalExistente = await AnimalModel.buscarPorId(id);
    if (!animalExistente) {
      throw new Error("Animal não encontrado.");
    }

    return AnimalModel.atualizarStatus(id, status);
  },

  /**
   * RF20: Moderação e Atualização Geral
   * ATUALIZADO: Agora verifica se o usuarioLogadoId é o dono do animal antes de editar
   */
  async atualizarDados(id, dados, usuarioLogadoId) {
    const animalExistente = await AnimalModel.buscarPorId(id);
    
    if (!animalExistente) {
      throw new Error("Impossível atualizar: animal inexistente.");
    }

    // Validação de Propriedade: Verifica se quem solicita é a ONG ou Protetor do animal
    const donoId = animalExistente.ong_id || animalExistente.protetor_id;
    if (donoId !== parseInt(usuarioLogadoId)) {
      throw new Error("Acesso negado: Você não tem permissão para editar este animal.");
    }

    // Se o porte estiver sendo atualizado, validamos novamente
    if (dados.porte) {
      const portesValidos = ['Pequeno', 'Médio', 'Grande', 'Não informado'];
      if (!portesValidos.includes(dados.porte)) {
        throw new Error("Porte inválido.");
      }
    }

    return AnimalModel.atualizar(id, dados);
  },

  /**
   * Exclusão (Moderação RF20)
   * ATUALIZADO: Agora verifica se o usuarioLogadoId é o dono antes de excluir
   */
  async excluirAnimal(id, usuarioLogadoId) {
    const animal = await AnimalModel.buscarPorId(id);
    
    if (!animal) {
      throw new Error("Animal já não existe no sistema.");
    }

    // Validação de Propriedade: Apenas o dono pode excluir seu post
    const donoId = animal.ong_id || animal.protetor_id;
    if (donoId !== parseInt(usuarioLogadoId)) {
        throw new Error("Acesso negado: Você não tem permissão para excluir este animal.");
    }

    return AnimalModel.excluir(id);
  }
};