import { UsuarioModel } from "../models/UsuarioModel.js";
import db from "../config/db.js"; 

export const UsuarioService = {
  /**
   * RF01: Cadastrar Usuário
   * Cria a conta principal e o perfil detalhado vinculado.
   */
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
      const nome = dados.nome || "Novo Usuário";
      
      const sqlManual = `INSERT INTO ${tabelaExtra} (usuario_id, nome) VALUES (?, ?)`;
      
      try {
        await db.promise().query(sqlManual, [novoUsuarioId, nome]);
      } catch (err) {
        console.error(`Erro ao criar perfil em ${tabelaExtra}:`, err);
        throw new Error("Erro ao criar perfil de usuário.");
      }
    }

    return result;
  },

  /**
   * RF03: Salvar Documento de Verificação
   * Lógica para salvar o caminho do comprovativo enviado por ONGs/Protetores.
   */
  async salvarDocumentoVerificacao(usuarioId, caminhoFicheiro) {
    // 1. Busca o usuário para saber o tipo (ONG ou PROTETOR)
    const [rows] = await db.promise().query(
        "SELECT tipo FROM usuarios WHERE id = ?", [usuarioId]
    );
    
    const usuario = rows[0];
    if (!usuario) throw new Error("Usuário não encontrado.");

    // 2. Define a tabela correta baseada no tipo
    let tabela = "";
    if (usuario.tipo === "ONG") tabela = "ongs";
    else if (usuario.tipo === "PROTETOR") tabela = "protetores_individuais";

    if (!tabela) {
        throw new Error("Apenas perfis de ONG ou Protetor precisam de verificação documental.");
    }

    // 3. Atualiza a coluna documento_url na tabela correspondente
    // Utilizamos o UsuarioModel.atualizarDetalhes que já existe no seu projeto
    return await UsuarioModel.atualizarDetalhes(tabela, { documento_url: caminhoFicheiro }, usuarioId);
  },

  /**
   * Login de Usuário
   */
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
      status_conta: usuario.status_conta 
    };
  },

  /**
   * Editar Perfil
   */
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
      return await UsuarioModel.atualizarDetalhes(tabela, dados, id);
    }
  },

  /**
   * Excluir Conta
   */
  async deletarConta(id) {
    return await UsuarioModel.excluir(id);
  }
};