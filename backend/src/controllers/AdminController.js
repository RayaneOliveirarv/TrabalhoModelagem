import { AdminModel } from "../models/AdminModel.js";
import { UsuarioModel } from "../models/UsuarioModel.js";
import { AnimalModel } from "../models/AnimalModel.js";

// RF19: Listar todos os usuários para o painel
export const getPainelGeral = async (req, res) => {
  try {
    const usuarios = await AdminModel.listarTodosUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// RF19: Bloquear Usuário com Motivo Justificado
export const moderarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { acao, motivo } = req.body; // acao: 'Bloqueado' ou 'Ativo'

    if (acao === 'Bloqueado' && !motivo) {
      return res.status(400).json({ erro: "É obrigatório informar o motivo do bloqueio." });
    }

    await AdminModel.atualizarStatusComMotivo(id, acao, motivo);
    res.json({ mensagem: `Status do usuário atualizado para ${acao}.` });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// RF20: Excluir Postagens Irregulares (Moderação de Conteúdo)
export const moderarAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    await AnimalModel.excluir(id);
    res.json({ mensagem: "Postagem removida por violação das regras." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// RF03: Aprovar cadastro de ONGs
export const aprovarCadastroONG = async (req, res) => {
  try {
    const { id } = req.params;
    const { decisao } = req.body; // 'Ativo' ou 'Bloqueado'
    await AdminModel.atualizarStatusComMotivo(id, decisao, "Aprovação de cadastro de ONG");
    res.json({ mensagem: `Cadastro de ONG: ${decisao}` });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// RF20: Listar denúncias de usuários pendentes para o Admin
export const listarDenunciasUsuarios = async (req, res) => {
  try {
    const denuncias = await AdminModel.listarDenunciasUsuarios();
    res.json(denuncias);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};