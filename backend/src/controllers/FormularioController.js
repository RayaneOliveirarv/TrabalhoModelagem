import { FormularioModel } from "../models/FormularioModel.js";
import { AdocaoService } from "../services/AdocaoService.js";
import db from "../config/db.js";

/**
 * Função auxiliar interna para verificar se um utilizador está ativo.
 * Garante que apenas usuários aprovados pelo Admin possam operar no sistema.
 */
const verificarUsuarioAtivo = async (id) => {
  if (!id) return false;
  const [rows] = await db.promise().query(
    "SELECT status_conta FROM usuarios WHERE id = ?", 
    [id]
  );
  // Compara em minúsculas para evitar erros de case-sensitive
  return rows[0] && rows[0].status_conta.toLowerCase() === 'ativo';
};

// RF10: Envia um novo formulário de intenção de adoção
export const enviarFormulario = async (req, res) => {
  try {
    const { adotante_id, animal_id, experiencia, ambiente } = req.body;

    // 1. Validação básica de campos obrigatórios
    if (!adotante_id || !animal_id || !experiencia || !ambiente) {
      return res.status(400).json({ erro: "Campos obrigatórios: adotante_id, animal_id, experiencia, ambiente." });
    }

    // 2. Verifica se o adotante está ativo antes de permitir o envio
    if (!(await verificarUsuarioAtivo(adotante_id))) {
      return res.status(403).json({ 
        erro: "A tua conta ainda está pendente de aprovação ou está bloqueada. Não podes enviar formulários." 
      });
    }

    // 3. Chama o Service que contém a lógica de mudar status do animal para 'Em_Analise'
    // e criar o registo no banco de dados.
    const result = await AdocaoService.enviarFormulario(req.body);
    
    res.status(201).json({
      mensagem: "Formulário enviado com sucesso! O protetor analisará o seu perfil.",
      formularioId: result.insertId
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// RF18: Aprovar ou Recusar um formulário (Decisão do Protetor/ONG)
export const decidirFormulario = async (req, res) => {
  try {
    const { id } = req.params; // ID do formulário
    const { decisao, usuario_id } = req.body; // 'Aprovado' ou 'Rejeitado' e ID de quem decide

    // 1. Verifica se quem está a decidir tem uma conta ativa
    if (!(await verificarUsuarioAtivo(usuario_id))) {
      return res.status(403).json({ 
        erro: "Ação bloqueada: a tua conta não está ativa ou foi bloqueada." 
      });
    }

    // 2. Valida a entrada da decisão
    if (!["Aprovado", "Rejeitado"].includes(decisao)) {
      return res.status(400).json({ erro: "Decisão inválida. Use 'Aprovado' ou 'Rejeitado'." });
    }

    /**
     * 3. O AdocaoService cuidará de:
     * - Atualizar o status do formulário
     * - Mudar o status do animal (Adotado ou Disponível)
     * - Gerar o PDF do Termo de Responsabilidade se aprovado
     */
    const mensagem = await AdocaoService.decidirFormulario(id, decisao);
    
    res.json({ mensagem });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

/**
 * RF18: Listar solicitações recebidas por uma ONG ou Protetor (Para o Painel de Gestão)
 * Utiliza o query string para filtrar, ex: GET /formularios/recebidos?tipo=ong_id&id=5
 */
export const listarSolicitacoesProtetor = async (req, res) => {
  try {
    const { tipo, id } = req.query; 

    if (!["ong_id", "protetor_id"].includes(tipo)) {
      return res.status(400).json({ erro: "Tipo de identificador inválido. Use 'ong_id' ou 'protetor_id'." });
    }

    // Verifica se o dono da conta (ONG/Protetor) está ativo para aceder aos dados
    if (!(await verificarUsuarioAtivo(id))) {
      return res.status(403).json({ erro: "Acesso negado: a tua conta não está ativa." });
    }

    const solicitacoes = await FormularioModel.listarPorDono(tipo, id);
    res.json(solicitacoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

/**
 * RF12: Adotante acompanha o status das suas solicitações (Para a "Minha Área")
 */
export const acompanharStatusAdotante = async (req, res) => {
  try {
    const { adotanteId } = req.params;

    // 1. Verifica se o usuário existe e não está bloqueado
    const [rows] = await db.promise().query(
      "SELECT status_conta FROM usuarios WHERE id = ?", [adotanteId]
    );

    if (!rows[0]) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    if (rows[0].status_conta.toLowerCase() === 'bloqueado') {
      return res.status(403).json({ 
        erro: "Conta bloqueada. Contacte o administrador para mais informações." 
      });
    }

    // 2. Busca todos os formulários enviados por este adotante no Model
    const solicitacoes = await FormularioModel.listarPorAdotante(adotanteId);
    res.json(solicitacoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};