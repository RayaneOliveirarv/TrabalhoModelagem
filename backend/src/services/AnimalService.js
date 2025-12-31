import { AnimalModel } from "../models/AnimalModel.js";

export const AnimalService = {
  cadastrar(dados) {
    if (!dados.ong_id && !dados.protetor_id) {
      throw new Error("Informe ong_id ou protetor_id");
    }
    
    // Validação de Porte (RF06)
    const portesValidos = ['Pequeno', 'Médio', 'Grande', 'Não informado'];
    if (dados.porte && !portesValidos.includes(dados.porte)) {
      throw new Error("Porte inválido. Escolha: Pequeno, Médio ou Grande.");
    }

    return AnimalModel.criar(dados);
  },

  listarComFiltros(filtros) {
    return AnimalModel.buscarAvancada(filtros);
  },

  buscarPorId(id) {
    return AnimalModel.buscarPorId(id);
  },

  atualizarStatus(id, status) {
    return AnimalModel.atualizarStatus(id, status);
  }
};