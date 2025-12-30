import { FormularioModel } from "../models/FormularioModel.js";
import { AdocaoService } from "../services/AdocaoService.js";

// Envia um novo formulário de adoção
export const enviarFormulario = async (req, res) => {
  try {
    const result = await AdocaoService.enviarFormulario(req.body);
    res.status(201).json({
      mensagem: "Formulário enviado",
      formularioId: result.insertId
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// PADRONIZADO: Nome alterado para decidirFormulario
export const decidirFormulario = async (req, res) => {
  try {
    const { id } = req.params;
    const { decisao } = req.body; // No Postman envie: {"decisao": "Aprovado"} ou "Recusado"

    // Chama o service. Certifique-se que no AdocaoService o método se chama decidirFormulario ou decidir
    const mensagem = await AdocaoService.decidirFormulario(id, decisao);

    res.json({ mensagem });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const listarSolicitacoesProtetor = async (req, res) => {
  try {
    const { tipo, id } = req.query; 
    if (!["ong_id", "protetor_id"].includes(tipo)) {
      return res.status(400).json({ erro: "Tipo inválido" });
    }
    const solicitacoes = await FormularioModel.listarPorDono(tipo, id);
    res.json(solicitacoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

export const acompanharStatusAdotante = async (req, res) => {
  try {
    const { adotanteId } = req.params;
    const solicitacoes = await FormularioModel.listarPorAdotante(adotanteId);
    res.json(solicitacoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};