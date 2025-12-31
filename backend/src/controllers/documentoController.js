import { DocumentoService } from "../services/DocumentoService.js";
import { FormularioModel } from "../models/FormularioModel.js";
import path from "path";
import fs from "fs";
import db from "../config/db.js"; 

export const gerarDocumentoAdocao = async (req, res) => {
  try {
    const { formularioId } = req.params;
    const dados = await FormularioModel.buscarDadosParaPdf(formularioId);
    
    if (!dados) return res.status(404).json({ erro: "Dados não encontrados." });

    const caminhoRelativo = await DocumentoService.gerarTermoAdocao(dados);
    await FormularioModel.salvarCaminhoDocumento(formularioId, caminhoRelativo);

    res.json({ mensagem: "Documento gerado", caminho: caminhoRelativo });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

export const baixarDocumento = async (req, res) => {
  try {
    const { formularioId } = req.params;
    const [resultado] = await db.promise().query(
      "SELECT documento_caminho FROM formularios_adocao WHERE id = ?", [formularioId]
    );

    if (!resultado[0]?.documento_caminho) return res.status(404).json({ erro: "PDF não encontrado." });

    const caminhoAbsoluto = path.resolve(resultado[0].documento_caminho);
    if (fs.existsSync(caminhoAbsoluto)) {
      res.download(caminhoAbsoluto); // RF16 e A11
    } else {
      res.status(404).json({ erro: "Arquivo físico removido." });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};