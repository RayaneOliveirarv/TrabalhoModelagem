import { FormularioModel } from "../models/FormularioModel.js";
import { AdocaoService } from "../services/AdocaoService.js";
import db from "../config/db.js";

// Função auxiliar interna para verificar se um utilizador está ativo
const verificarUsuarioAtivo = async (id) => {
  if (!id) return false;
  const [rows] = await db.promise().query(
    "SELECT status_conta FROM usuarios WHERE id = ?", 
    [id]
  );
  return rows[0] && rows[0].status_conta.toLowerCase() === 'ativo';
};

// RF10: Envia um novo formulário de adoção
export const enviarFormulario = async (req, res) => {
  try {
    const { adotante_id } = req.body;

    // Verifica se o adotante está ativo antes de permitir o envio
    if (!(await verificarUsuarioAtivo(adotante_id))) {
      return res.status(403).json({ 
        erro: "A tua conta ainda está pendente de aprovação ou está bloqueada. Não podes enviar formulários." 
      });
    }

    const result = await AdocaoService.enviarFormulario(req.body);
    res.status(201).json({
      mensagem: "Formulário enviado com sucesso",
      formularioId: result.insertId
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// RF18: Aprovar ou Recusar um formulário (Decisão do Protetor/ONG)
export const decidirFormulario = async (req, res) => {
  try {
    const { id } = req.params;
    const { decisao, usuario_id } = req.body; // No Postman envie: {"decisao": "Aprovado", "usuario_id": 1}

    // Verifica se quem está a decidir tem uma conta ativa
    if (!(await verificarUsuarioAtivo(usuario_id))) {
      return res.status(403).json({ 
        erro: "Ação bloqueada: a tua conta não está ativa ou foi bloqueada." 
      });
    }

    if (!["Aprovado", "Rejeitado"].includes(decisao)) {
      return res.status(400).json({ erro: "Decisão inválida. Use 'Aprovado' ou 'Rejeitado'." });
    }

    const mensagem = await AdocaoService.decidirFormulario(id, decisao);
    res.json({ mensagem });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// Listar solicitações recebidas por uma ONG ou Protetor
export const listarSolicitacoesProtetor = async (req, res) => {
  try {
    const { tipo, id } = req.query; 

    if (!["ong_id", "protetor_id"].includes(tipo)) {
      return res.status(400).json({ erro: "Tipo de identificador inválido." });
    }

    // Verifica se o dono da conta está ativo para ver as solicitações
    if (!(await verificarUsuarioAtivo(id))) {
      return res.status(403).json({ erro: "Acesso negado: conta inativa." });
    }

    const solicitacoes = await FormularioModel.listarPorDono(tipo, id);
    res.json(solicitacoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// RF12: Adotante acompanha o status das suas solicitações
export const acompanharStatusAdotante = async (req, res) => {
  try {
    const { adotanteId } = req.params;

    // O adotante pode ver o status mesmo se estiver pendente, mas não se estiver bloqueado
    const [rows] = await db.promise().query(
      "SELECT status_conta FROM usuarios WHERE id = ?", [adotanteId]
    );

    if (rows[0] && rows[0].status_conta === 'Bloqueado') {
      return res.status(403).json({ erro: "Conta bloqueada. Contacte o administrador." });
    }

    const solicitacoes = await FormularioModel.listarPorAdotante(adotanteId);
    res.json(solicitacoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};