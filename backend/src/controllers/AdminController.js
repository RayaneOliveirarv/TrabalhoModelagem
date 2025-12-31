import { AdminModel } from "../models/AdminModel.js";
import { UsuarioModel } from "../models/UsuarioModel.js";
import { AnimalModel } from "../models/AnimalModel.js";
import { NotificacaoModel } from "../models/NotificacaoModel.js";

/**
 * RF19: Listar todos os usuários para o painel administrativo.
 * Retorna ID, email, tipo e o status atual da conta.
 */
export const getPainelGeral = async (req, res) => {
  try {
    const usuarios = await AdminModel.listarTodosUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

/**
 * RF19: Bloquear ou Ativar Usuário com Justificativa.
 * Além de atualizar o status, envia uma notificação ao utilizador.
 */
export const moderarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { acao, motivo } = req.body; // acao: 'Bloqueado', 'Ativo' ou 'Pendente'

    if (acao === 'Bloqueado' && !motivo) {
      return res.status(400).json({ erro: "É obrigatório informar o motivo do bloqueio para fins de moderação." });
    }

    const justificativa = motivo || "Alteração manual pelo administrador";
    await AdminModel.atualizarStatusComMotivo(id, acao, justificativa);

    // --- RF19: Sistema de Notificações ---
    const titulo = acao === 'Bloqueado' ? "Sua conta foi suspensa" : "Atualização de Perfil";
    const tipoNotif = acao === 'Ativo' ? 'SUCESSO' : (acao === 'Bloqueado' ? 'ERRO' : 'INFORMATIVO');
    
    await NotificacaoModel.criar(
      id, 
      titulo, 
      `O status da sua conta foi alterado para: ${acao}. Motivo: ${justificativa}`,
      tipoNotif
    );

    res.json({ mensagem: `Status do usuário atualizado para ${acao} e notificação enviada.` });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

/**
 * RF20: Excluir Postagens Irregulares (Moderação de Conteúdo).
 * Notifica o dono do animal sobre a remoção da postagem.
 */
export const moderarAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { justificativa } = req.body; // Recomendado enviar justificativa no corpo
    
    const animal = await AnimalModel.buscarPorId(id);
    if (!animal) {
      return res.status(404).json({ erro: "Animal não encontrado ou já removido." });
    }

    const donoId = animal.ong_id || animal.protetor_id;

    // Remove o animal
    await AnimalModel.excluir(id);

    // --- RF20: Notificar o dono sobre a remoção ---
    if (donoId) {
      await NotificacaoModel.criar(
        donoId,
        "Postagem Removida",
        `O anúncio do animal "${animal.nome}" foi removido por violação das diretrizes. Motivo: ${justificativa || "Conteúdo irregular"}.`,
        'ALERTA'
      );
    }

    res.json({ mensagem: "A postagem do animal foi removida e o responsável notificado." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

/**
 * RF03: Aprovar cadastro de ONGs e Protetores.
 * Essencial para validar a documentação enviada via upload.
 */
export const aprovarCadastroONG = async (req, res) => {
  try {
    const { id } = req.params;
    const { decisao, motivo } = req.body; // Esperado: 'Ativo' ou 'Bloqueado'

    if (!['Ativo', 'Bloqueado'].includes(decisao)) {
      return res.status(400).json({ erro: "Decisão inválida. Use 'Ativo' para aprovar ou 'Bloqueado' para recusar." });
    }

    const justificativa = motivo || (decisao === 'Ativo' 
      ? "Sua documentação foi revisada e aprovada com sucesso!" 
      : "Documentação insuficiente ou inválida.");

    await AdminModel.atualizarStatusComMotivo(id, decisao, justificativa);

    // --- RF03/RF19: Notificação de Boas-vindas ou Recusa ---
    await NotificacaoModel.criar(
      id,
      decisao === 'Ativo' ? "Bem-vindo à plataforma!" : "Problema na Verificação",
      justificativa,
      decisao === 'Ativo' ? 'SUCESSO' : 'ERRO'
    );

    res.json({ mensagem: `O cadastro do usuário foi definido como: ${decisao}` });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

/**
 * RF20: Listar denúncias de usuários pendentes.
 */
export const listarDenunciasUsuarios = async (req, res) => {
  try {
    const denuncias = await AdminModel.listarDenunciasUsuarios();
    res.json(denuncias);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};