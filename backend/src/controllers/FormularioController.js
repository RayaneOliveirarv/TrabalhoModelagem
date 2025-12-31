// Importa o Model para consultas ao banco e o Service para a lógica complexa de negócio
import { FormularioModel } from "../models/FormularioModel.js";
import { AdocaoService } from "../services/AdocaoService.js";
import db from "../config/db.js";

/**
 * FUNÇÃO AUXILIAR: Verifica se um usuário (adotante ou protetor) está com a conta 'Ativo'.
 * Isso impede que usuários bloqueados ou ainda não aprovados pelo Admin operem no sistema.
 */
const verificarUsuarioAtivo = async (id) => {
  if (!id) return false;
  const [rows] = await db.promise().query(
    "SELECT status_conta FROM usuarios WHERE id = ?", 
    [id]
  );
  // Converte para minúsculas para garantir que a comparação funcione mesmo que no banco esteja 'ATIVO' ou 'ativo'
  return rows[0] && rows[0].status_conta.toLowerCase() === 'ativo';
};

/**
 * RF10: Envia um novo formulário de intenção de adoção.
 * É o primeiro passo oficial que o adotante dá para demonstrar interesse.
 */
export const enviarFormulario = async (req, res) => {
  try {
    const { adotante_id, animal_id, experiencia, ambiente } = req.body;

    // 1. Validação: Garante que o front-end enviou todos os dados necessários
    if (!adotante_id || !animal_id || !experiencia || !ambiente) {
      return res.status(400).json({ erro: "Campos obrigatórios: adotante_id, animal_id, experiencia, ambiente." });
    }

    // 2. Segurança: Só permite o envio se o adotante estiver com a conta ativa e validada
    if (!(await verificarUsuarioAtivo(adotante_id))) {
      return res.status(403).json({ 
        erro: "A tua conta ainda está pendente de aprovação ou está bloqueada. Não podes enviar formulários." 
      });
    }

    // 3. Delega a ação para o AdocaoService.
    // O Service vai salvar o formulário E mudar o status do animal para 'Em_Analise' simultaneamente.
    const result = await AdocaoService.enviarFormulario(req.body);
    
    res.status(201).json({
      mensagem: "Formulário enviado com sucesso! O protetor analisará o seu perfil.",
      formularioId: result.insertId
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

/**
 * RF18: Aprovar ou Recusar um formulário.
 * Usado pelas ONGs/Protetores para decidir o destino de um animal.
 */
export const decidirFormulario = async (req, res) => {
  try {
    const { id } = req.params; // ID do formulário em questão
    const { decisao, usuario_id } = req.body; // 'Aprovado' ou 'Rejeitado'

    // 1. Verifica se quem está decidindo (ONG/Protetor) tem permissão e conta ativa
    if (!(await verificarUsuarioAtivo(usuario_id))) {
      return res.status(403).json({ 
        erro: "Ação bloqueada: a tua conta não está ativa ou foi bloqueada." 
      });
    }

    // 2. Validação de segurança para aceitar apenas os termos permitidos
    if (!["Aprovado", "Rejeitado"].includes(decisao)) {
      return res.status(400).json({ erro: "Decisão inválida. Use 'Aprovado' ou 'Rejeitado'." });
    }

    // 3. O Service executa uma "cascata" de ações:
    // - Atualiza o status do formulário.
    // - Muda o status do animal (se aprovado -> 'Adotado', se rejeitado -> 'Disponível').
    // - Se aprovado, gera automaticamente o PDF do Termo de Responsabilidade.
    const mensagem = await AdocaoService.decidirFormulario(id, decisao);
    
    res.json({ mensagem });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

/**
 * RF18: Listar solicitações recebidas.
 * Mostra para a ONG ou Protetor todos os formulários que chegaram para os seus animais.
 */
export const listarSolicitacoesProtetor = async (req, res) => {
  try {
    const { tipo, id } = req.query; // Ex: ?tipo=ong_id&id=10

    // Garante que o filtro seja feito pelo tipo correto de dono do animal
    if (!["ong_id", "protetor_id"].includes(tipo)) {
      return res.status(400).json({ erro: "Tipo de identificador inválido. Use 'ong_id' ou 'protetor_id'." });
    }

    // Verifica se a ONG/Protetor está ativa antes de mostrar dados sensíveis dos adotantes
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
 * RF12: Acompanhamento pelo Adotante.
 * Permite que a pessoa que quer adotar veja se o seu pedido foi aprovado, recusado ou está em análise.
 */
export const acompanharStatusAdotante = async (req, res) => {
  try {
    const { adotanteId } = req.params;

    // 1. Verifica existência e status da conta do adotante
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

    // 2. Retorna a lista de formulários enviados por este adotante
    const solicitacoes = await FormularioModel.listarPorAdotante(adotanteId);
    res.json(solicitacoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};