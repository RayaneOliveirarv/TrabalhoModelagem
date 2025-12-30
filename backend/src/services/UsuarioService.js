import { UsuarioModel } from "../models/UsuarioModel.js";
import db from "../config/db.js"; // Import necessário para a lógica extra

export const UsuarioService = {
  async cadastrar(dados) {
    const existente = await UsuarioModel.buscarPorEmail(dados.email);

    if (existente) {
      throw new Error("Email já cadastrado");
    }

    // 1. Cria o usuário na tabela principal 'usuarios'
    const result = await UsuarioModel.criar(
      dados.email,
      dados.senha,
      dados.tipo
    );

    const novoUsuarioId = result.insertId;

    // 2. Lógica para criar o perfil automático e evitar erro de Foreign Key
    let tabelaExtra = "";
    if (dados.tipo === "ADOTANTE") tabelaExtra = "adotantes";
    else if (dados.tipo === "ONG") tabelaExtra = "ongs";
    else if (dados.tipo === "PROTETOR") tabelaExtra = "protetores_individuais";

    if (tabelaExtra) {
      // O campo 'nome' vem do corpo da requisição (RF01) ou vira 'Novo Usuário' por padrão
      const nome = dados.nome || "Novo Usuário";
      
      // Inserção direta na tabela de detalhes para vincular o usuario_id
      const sqlManual = `INSERT INTO ${tabelaExtra} (usuario_id, nome) VALUES (?, ?)`;
      
      try {
        await db.promise().query(sqlManual, [novoUsuarioId, nome]);
      } catch (err) {
        console.error(`Erro ao criar perfil em ${tabelaExtra}:`, err);
        // Opcional: deletar o usuário criado se a criação do perfil falhar
        throw new Error("Erro ao criar perfil de usuário.");
      }
    }

    return result;
  },

  async login(dados) {
    const usuario = await UsuarioModel.buscarPorEmail(dados.email);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    if (usuario.senha !== dados.senha) {
      throw new Error("Senha incorreta");
    }

    return {
      id: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
      status_conta: usuario.status_conta // Adicionado para facilitar o controle no front
    };
  },

  async editarPerfil(id, tipo, dados) {
    if (dados.senha) {
      await UsuarioModel.atualizarSenha(id, dados.senha);
      delete dados.senha;
    }

    let tabela = "";
    if (tipo === "ADOTANTE") tabela = "adotantes";
    else if (tipo === "ONG") tabela = "ongs";
    else if (tipo === "PROTETOR") tabela = "protetores_individuais";

    if (tabela && Object.keys(dados).length > 0) {
      // Importante: no seu Model, o parâmetro é (tabela, dados, usuarioId)
      return await UsuarioModel.atualizarDetalhes(tabela, dados, id);
    }
  },

  async deletarConta(id) {
    return await UsuarioModel.excluir(id);
  }
};