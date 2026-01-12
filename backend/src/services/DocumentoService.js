import { gerarPDFAdocao } from "../utils/gerarPDF.js";
import path from "path";

export const DocumentoService = {
  // Chamado pelo AdocaoService após aprovação
  async gerarTermoAdocao(dadosPdf) {
    if (!dadosPdf) {
      throw new Error("Dados para geração do PDF não fornecidos");
    }

    // 1. Define apenas o nome do arquivo
    const nomeArquivo = `termo_adocao_${dadosPdf.formulario_id}.pdf`;

    // 2. Cria um caminho ABSOLUTO para evitar duplicação de pastas
    // Isso resolve o erro de "no such file or directory"
    const caminhoCompleto = path.resolve("uploads", "documentos", nomeArquivo);

    try {
      // 3. Gera o arquivo físico usando o utilitário
      await gerarPDFAdocao(dadosPdf, caminhoCompleto);
      
      // 4. Retorna o caminho que será salvo no banco de dados
      return `uploads/documentos/${nomeArquivo}`;
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      throw new Error("Falha na geração do arquivo PDF");
    }
  }
};