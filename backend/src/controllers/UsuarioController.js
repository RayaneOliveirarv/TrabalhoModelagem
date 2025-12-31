import { UsuarioService } from "../services/UsuarioService.js";

/**
 * RF01: Cadastro de Usuário
 * Realiza o registro inicial nas tabelas 'usuarios' e perfis (adotantes, ongs, protetores).
 */
export const cadastrarUsuario = async (req, res) => {
  try {
    const result = await UsuarioService.cadastrar(req.body);

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuarioId: result.insertId
    });
  } catch (err) {
    if (err.message.includes("Email")) {
      return res.status(409).json({ erro: err.message });
    }
    res.status(400).json({ erro: err.message });
  }
};

/**
 * RF03: Enviar Documentação de Verificação (ONGs e Protetores)
 * Recebe o arquivo via Multer e salva o caminho no banco de dados para análise do Admin.
 */
export const enviarDocumentacao = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifica se o arquivo foi enviado pelo middleware multer
    if (!req.file) {
      return res.status(400).json({ erro: "Por favor, selecione um arquivo (PDF ou Imagem) para enviar." });
    }

    // O caminho do arquivo salvo no servidor
    const documentoUrl = req.file.path;

    // Chama o service para identificar o tipo de usuário e salvar na tabela correta
    await UsuarioService.salvarDocumentoVerificacao(id, documentoUrl);

    res.json({ 
      mensagem: "Documentação enviada com sucesso! O Administrador irá analisar para ativar sua conta.",
      arquivo: documentoUrl 
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

/**
 * Login de Usuário
 */
export const loginUsuario = async (req, res) => {
  try {
    const usuario = await UsuarioService.login(req.body);
    res.json(usuario);
  } catch (err) {
    res.status(401).json({ erro: err.message });
  }
};

/**
 * Atualizar Perfil de Usuário
 */
export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, ...dados } = req.body; 
    await UsuarioService.editarPerfil(id, tipo, dados);
    res.json({ mensagem: "Perfil atualizado com sucesso" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

/**
 * Excluir Conta
 */
export const deletarUsuario = async (req, res) => {
  try {
    await UsuarioService.deletarConta(req.params.id);
    res.json({ mensagem: "Conta excluída com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};