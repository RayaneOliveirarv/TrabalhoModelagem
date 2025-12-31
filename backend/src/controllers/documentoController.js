import { DocumentoService } from "../services/DocumentoService.js";
import { FormularioModel } from "../models/FormularioModel.js";
import path from "path";
import fs from "fs";
import db from "../config/db.js"; 

/**
 * RF15: Gerar Documento de Adoção
 * Este método aciona o serviço de PDF usando os dados do formulário aprovado.
 */
export const gerarDocumentoAdocao = async (req, res) => {
  try {
    const { formularioId } = req.params;
    
    // 1. Busca os dados formatados (adotante, animal e responsável) no FormularioModel
    const dados = await FormularioModel.buscarDadosParaPdf(formularioId);
    
    if (!dados) {
      return res.status(404).json({ erro: "Dados para o formulário não encontrados no banco de dados." });
    }

    // 2. Chama o Service para criar o PDF físico na pasta /uploads/documentos
    const caminhoRelativo = await DocumentoService.gerarTermoAdocao(dados);
    
    // 3. Atualiza a tabela 'formularios_adocao' com o caminho do ficheiro gerado
    await FormularioModel.salvarCaminhoDocumento(formularioId, caminhoRelativo);

    res.json({ 
      mensagem: "Termo de Responsabilidade gerado com sucesso!", 
      caminho: caminhoRelativo 
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

/**
 * RF16 & A11: Download do Documento
 * Permite que o adotante baixe o PDF gerado anteriormente.
 */
export const baixarDocumento = async (req, res) => {
  try {
    const { formularioId } = req.params;

    // 1. Consulta o banco para obter o caminho do arquivo salvo no formulário
    const [resultado] = await db.promise().query(
      "SELECT documento_caminho FROM formularios_adocao WHERE id = ?", 
      [formularioId]
    );

    const caminhoNoBanco = resultado[0]?.documento_caminho;

    if (!caminhoNoBanco) {
      return res.status(404).json({ erro: "O PDF ainda não foi gerado para este formulário." });
    }

    // 2. Resolve o caminho absoluto para o Node encontrar o arquivo no disco
    const caminhoAbsoluto = path.resolve(caminhoNoBanco);

    // 3. Verifica se o arquivo físico realmente existe na pasta uploads
    if (fs.existsSync(caminhoAbsoluto)) {
      // Força o download no navegador (RF16)
      res.download(caminhoAbsoluto, (err) => {
        if (err) {
          if (!res.headersSent) {
            res.status(500).json({ erro: "Erro ao processar o download do ficheiro." });
          }
        }
      });
    } else {
      res.status(404).json({ 
        erro: "O arquivo PDF foi removido do servidor ou o caminho está incorreto." 
      });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};