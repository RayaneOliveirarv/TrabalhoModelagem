import { UsuarioService } from "../services/UsuarioService.js";

export const cadastrarUsuario = async (req, res) => {
  try {
    const result = await UsuarioService.cadastrar(req.body);

    res.status(201).json({
      mensagem: "Usuário cadastrado",
      usuarioId: result.insertId
    });
  } catch (err) {
    if (err.message.includes("Email")) {
      return res.status(409).json({ erro: err.message });
    }
    res.status(400).json({ erro: err.message });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const usuario = await UsuarioService.login(req.body);
    res.json(usuario);
  } catch (err) {
    res.status(401).json({ erro: err.message });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, ...dados } = req.body; // Extrai o tipo e o restante dos dados
    await UsuarioService.editarPerfil(id, tipo, dados);
    res.json({ mensagem: "Perfil atualizado com sucesso" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const deletarUsuario = async (req, res) => {
  try {
    await UsuarioService.deletarConta(req.params.id);
    res.json({ mensagem: "Conta excluída com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
