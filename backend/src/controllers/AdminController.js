import { AdminModel } from "../models/AdminModel.js";
import { UsuarioModel } from "../models/UsuarioModel.js";
import { AnimalModel } from "../models/AnimalModel.js";

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
 * O campo 'motivo' é obrigatório para bloqueios, garantindo auditoria.
 */
export const moderarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { acao, motivo } = req.body; // acao: 'Bloqueado', 'Ativo' ou 'Pendente'

    if (acao === 'Bloqueado' && !motivo) {
      return res.status(400).json({ erro: "É obrigatório informar o motivo do bloqueio para fins de moderação." });
    }

    await AdminModel.atualizarStatusComMotivo(id, acao, motivo || "Alteração manual pelo administrador");
    res.json({ mensagem: `Status do usuário atualizado para ${acao} com sucesso.` });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

/**
 * RF20: Excluir Postagens Irregulares (Moderação de Conteúdo).
 * Permite que o Admin apague anúncios de animais que não condizem com as regras da plataforma.
 */
export const moderarAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifica se o animal existe antes de tentar excluir
    const animal = await AnimalModel.buscarPorId(id);
    if (!animal) {
      return res.status(404).json({ erro: "Animal não encontrado ou já removido." });
    }

    await AnimalModel.excluir(id);
    res.json({ mensagem: "A postagem do animal foi removida permanentemente por violação das regras." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

/**
 * RF03: Aprovar cadastro de ONGs e Protetores.
 * Essencial para o seu teste, pois novos cadastros começam como 'Pendente'.
 */
export const aprovarCadastroONG = async (req, res) => {
  try {
    const { id } = req.params;
    const { decisao } = req.body; // Esperado: 'Ativo' ou 'Bloqueado'

    if (!['Ativo', 'Bloqueado'].includes(decisao)) {
      return res.status(400).json({ erro: "Decisão inválida. Use 'Ativo' para aprovar ou 'Bloqueado' para recusar." });
    }

    const justificativa = decisao === 'Ativo' 
      ? "Documentação revisada e aprovada." 
      : "Documentação insuficiente ou inválida.";

    await AdminModel.atualizarStatusComMotivo(id, decisao, justificativa);
    res.json({ mensagem: `O cadastro do usuário foi definido como: ${decisao}` });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

/**
 * RF20: Listar denúncias de usuários pendentes.
 * Mostra quem denunciou quem e por qual motivo, permitindo a tomada de decisão do Admin.
 */
export const listarDenunciasUsuarios = async (req, res) => {
  try {
    const denuncias = await AdminModel.listarDenunciasUsuarios();
    res.json(denuncias);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};