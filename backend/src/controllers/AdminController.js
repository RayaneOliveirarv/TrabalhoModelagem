// Importação dos Models que realizam as operações diretamente no Banco de Dados
import { AdminModel } from "../models/AdminModel.js";
import { UsuarioModel } from "../models/UsuarioModel.js";
import { AnimalModel } from "../models/AnimalModel.js";
import { NotificacaoModel } from "../models/NotificacaoModel.js";

/**
 * RF19: Listar todos os usuários para o painel administrativo.
 * Função que busca no banco a lista completa de pessoas cadastradas.
 */
export const getPainelGeral = async (req, res) => {
  try {
    // Chama o model para buscar dados como ID, email e status
    const usuarios = await AdminModel.listarTodosUsuarios();
    res.json(usuarios); // Retorna a lista em formato JSON para o front-end
  } catch (err) {
    // Caso haja erro no banco, retorna status 500 (Erro Interno)
    res.status(500).json({ erro: err.message });
  }
};

/**
 * RF19: Bloquear ou Ativar Usuário com Justificativa.
 * Permite ao admin mudar o status de uma conta e avisar o usuário do porquê.
 */
export const moderarUsuario = async (req, res) => {
  try {
    console.log("request no servidor: ", req.body);
    const { id } = req.params; // Pega o ID da URL
    const { acao, motivo } = req.body; // acao pode ser: 'Bloqueado', 'Ativo' ou 'Pendente'

    // Validação: Se for bloquear, é obrigatório dizer o motivo
    if (acao === 'Bloqueado' && !motivo) {
      return res.status(400).json({ erro: "É obrigatório informar o motivo do bloqueio para fins de moderação." });
    }

    // Define uma frase padrão caso o motivo venha vazio em outros casos
    const justificativa = motivo || "Alteração manual pelo administrador";
    
    // Atualiza o status do usuário no banco de dados
    await AdminModel.atualizarStatusComMotivo(id, acao, justificativa);

    // --- RF19: Sistema de Notificações ---
    // Define o título e a cor/tipo da notificação baseado na ação
    const titulo = acao === 'Bloqueado' ? "Sua conta foi suspensa" : "Atualização de Perfil";
    const tipoNotif = acao === 'Ativo' ? 'SUCESSO' : (acao === 'Bloqueado' ? 'ERRO' : 'INFORMATIVO');
    
    // Cria um registro na tabela de notificações para o usuário visualizar ao logar
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
 * Remove um animal do sistema e avisa o dono (ONG ou Protetor).
 */
export const moderarAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { justificativa } = req.body; 
    
    // Primeiro, busca o animal para saber quem é o dono antes de deletar
    const animal = await AnimalModel.buscarPorId(id);
    if (!animal) {
      return res.status(404).json({ erro: "Animal não encontrado ou já removido." });
    }

    // Identifica se o dono é uma ONG ou um Protetor individual
    const donoId = animal.ong_id || animal.protetor_id;

    // Remove o registro do animal do banco de dados definitivamente
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
 * Usado após o administrador revisar manualmente os documentos enviados.
 */
export const aprovarCadastroONG = async (req, res) => {
  try {
    const { id } = req.params;
    const { decisao, motivo } = req.body; // decisao: 'Ativo' (aprovar) ou 'Bloqueado' (recusar)

    // Garante que o admin só envie opções válidas
    if (!['Ativo', 'Bloqueado'].includes(decisao)) {
      return res.status(400).json({ erro: "Decisão inválida. Use 'Ativo' para aprovar ou 'Bloqueado' para recusar." });
    }

    // Mensagens automáticas de acordo com a aprovação ou reprovação
    const justificativa = motivo || (decisao === 'Ativo' 
      ? "Sua documentação foi revisada e aprovada com sucesso!" 
      : "Documentação insuficiente ou inválida.");

    // Atualiza o usuário para que ele possa começar a usar o sistema (se Ativo)
    await AdminModel.atualizarStatusComMotivo(id, decisao, justificativa);

    // Envia o feedback imediato via notificação interna
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
 * RF20: Listar denúncias.
 * Busca no banco relatos feitos por usuários contra outros perfis.
 */
export const listarDenunciasUsuarios = async (req, res) => {
  try {
    const denuncias = await AdminModel.listarDenunciasUsuarios();
    res.json(denuncias);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};