import { DocumentoService } from "../services/DocumentoService.js";
import { FormularioModel } from "../models/FormularioModel.js";
import path from "path";
import fs from "fs";
import db from "../config/db.js"; // Import para consulta rápida

export const gerarDocumentoAdocao = async (req, res) => {
  try {
    const { formularioId } = req.params;

    // Busca os dados necessários para preencher o PDF (RF15)
    const dados = await FormularioModel.buscarDadosParaPdf(formularioId);
    
    if (!dados) {
      return res.status(404).json({ erro: "Dados do formulário não encontrados." });
    }

    // Chama o service para criar o ficheiro físico
    const caminhoRelativo = await DocumentoService.gerarTermoAdocao(dados);

    // RF16: Guarda o caminho no banco de dados para referência futura
    await FormularioModel.salvarCaminhoDocumento(formularioId, caminhoRelativo);

    res.json({
      mensagem: "Documento gerado com sucesso",
      caminho: caminhoRelativo
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// A11: Ação de baixar o documento no portal do Adotante
export const baixarDocumento = async (req, res) => {
  try {
    const { formularioId } = req.params;

    // 1. Procura no banco qual é o arquivo associado a este formulário
    const [resultado] = await db.promise().query(
      "SELECT documento_caminho FROM formularios_adocao WHERE id = ?", 
      [formularioId]
    );

    if (!resultado[0] || !resultado[0].documento_caminho) {
      return res.status(404).json({ erro: "Documento não encontrado para este processo de adoção." });
    }

    // 2. Constrói o caminho absoluto para o ficheiro
    const caminhoAbsoluto = path.resolve(resultado[0].documento_caminho);

    // 3. Verifica se o ficheiro ainda existe no disco
    if (fs.existsSync(caminhoAbsoluto)) {
      // Força o download no navegador do usuário
      res.download(caminhoAbsoluto);
    } else {
      res.status(404).json({ erro: "O ficheiro físico foi removido ou movido no servidor." });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};