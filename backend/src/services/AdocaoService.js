import { FormularioModel } from "../models/FormularioModel.js";
import { AnimalModel } from "../models/AnimalModel.js";
import { DocumentoService } from "./DocumentoService.js";

const AdocaoService = {
  /**
   * RF10: Enviar Formulário de Intenção
   * Além de criar o registo, muda o status do animal para evitar múltiplas solicitações simultâneas.
   */
  async enviarFormulario(dados) {
    // 1. Verifica se o animal existe
    const animal = await AnimalModel.buscarPorId(dados.animal_id);
    if (!animal) throw new Error("Animal não encontrado");
    
    // 2. Verifica se o animal já não foi adotado por outrem
    if (animal.status === "Adotado") {
      throw new Error("Este animal já foi adotado e não está mais disponível.");
    }

    // 3. Cria o formulário no banco de dados
    const result = await FormularioModel.criar(dados);
    
    // 4. RF18: Altera o status do animal para 'Em_Analise' (conforme ENUM do MySQL)
    await AnimalModel.atualizarStatus(dados.animal_id, "Em_Analise");
    
    return result;
  },

  /**
   * RF18: Decidir Formulário (Aprovar ou Rejeitar)
   * Responsável por finalizar o processo e disparar a geração do documento (RF15).
   */
  async decidirFormulario(id, decisao, motivoRecusa = null) {
    // 1. Busca os detalhes do formulário
    const formulario = await FormularioModel.buscarPorId(id);
    if (!formulario) throw new Error("Formulário não encontrado no sistema.");

    // 2. Impede alteração de formulários já finalizados
    if (formulario.status === "Aprovado" || formulario.status === "Rejeitado" || formulario.status === "Recusado") {
      throw new Error(`Este formulário já foi finalizado como: ${formulario.status}`);
    }

    // 3. Atualiza o status do formulário no banco (Aprovado ou Rejeitado)
    await FormularioModel.atualizarStatus(id, decisao, motivoRecusa);

    // 4. Lógica de consequência da decisão
    if (decisao === "Aprovado") {
      // RF15: Se aprovado, busca dados formatados e gera o PDF automaticamente
      const dadosPdf = await FormularioModel.buscarDadosParaPdf(id);
      
      try {
        const pdfPath = await DocumentoService.gerarTermoAdocao(dadosPdf);
        // Salva o link do PDF no registo do formulário para download posterior (RF16)
        await FormularioModel.salvarCaminhoDocumento(id, pdfPath);
      } catch (err) {
        console.error("Erro ao gerar documento no fluxo de aprovação:", err);
        // Não travamos o processo, mas o log avisa que o PDF falhou
      }

      // RF18: Muda o status definitivo do animal para 'Adotado'
      await AnimalModel.atualizarStatus(formulario.animal_id, "Adotado");
      
    } else if (decisao === "Rejeitado" || decisao === "Recusado") {
      // Se for rejeitado, o animal volta a ficar 'Disponivel' para outros interessados
      await AnimalModel.atualizarStatus(formulario.animal_id, "Disponivel");
    }

    return `Processo finalizado com sucesso. Decisão: ${decisao}`;
  }
};

export { AdocaoService };