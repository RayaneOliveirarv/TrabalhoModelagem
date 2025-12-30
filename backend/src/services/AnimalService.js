import { AnimalModel } from "../models/AnimalModel.js";

export const AnimalService = {
  cadastrar(dados) {
    if (!dados.ong_id && !dados.protetor_id) {
      throw new Error("Informe ong_id ou protetor_id");
    }

    return AnimalModel.criar(dados);
  },

  listarDisponiveis() {
    return AnimalModel.listarDisponiveis();
  },

  buscarPorId(id) {
    return AnimalModel.buscarPorId(id);
  },

  atualizarStatus(id, status) {
    return AnimalModel.atualizarStatus(id, status);
  },

  listarAdotadosPorAdotante(adotanteId) {
    return AnimalModel.listarAdotadosPorAdotante(adotanteId);
  }
};
