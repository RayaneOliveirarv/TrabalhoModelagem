import { FormularioModel } from "../models/FormularioModel.js";
import { AnimalModel } from "../models/AnimalModel.js";
import { DocumentoService } from "./DocumentoService.js";

const AdocaoService = {
  async enviarFormulario(dados) {
    const animal = await AnimalModel.buscarPorId(dados.animal_id);
    if (!animal) throw new Error("Animal não encontrado");
    if (animal.status === "Adotado") throw new Error("Animal já foi adotado");

    const result = await FormularioModel.criar(dados);
    
    // CORREÇÃO: "Em Processo" foi alterado para "Em_Analise" para bater com o ENUM do MySQL
    await AnimalModel.atualizarStatus(dados.animal_id, "Em_Analise");
    return result;
  },

  async decidirFormulario(id, decisao, motivoRecusa = null) {
    const formulario = await FormularioModel.buscarPorId(id);
    if (!formulario) throw new Error("Formulário não encontrado");

    if (formulario.status === "Aprovado" || formulario.status === "Recusado") {
      throw new Error(`Este formulário já foi finalizado como: ${formulario.status}`);
    }

    // No MySQL o ENUM para rejeição é 'Rejeitado', certifique-se que 'decisao' vinda do Postman seja 'Aprovado' ou 'Rejeitado'
    await FormularioModel.atualizarStatus(id, decisao, motivoRecusa);

    if (decisao === "Aprovado") {
      const dadosPdf = await FormularioModel.buscarDadosParaPdf(id);
      const pdfPath = await DocumentoService.gerarTermoAdocao(dadosPdf);
      await FormularioModel.salvarCaminhoDocumento(id, pdfPath);

      await AnimalModel.atualizarStatus(formulario.animal_id, "Adotado");
    } 
    else if (decisao === "Rejeitado" || decisao === "Recusado") {
      // Retorna para Disponivel se não for aprovado
      await AnimalModel.atualizarStatus(formulario.animal_id, "Disponivel");
    }

    return `Processo finalizado com sucesso: ${decisao}`;
  }
};

export { AdocaoService };