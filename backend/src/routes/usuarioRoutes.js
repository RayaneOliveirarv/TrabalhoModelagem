import express from "express";
import { 
  cadastrarUsuario, 
  loginUsuario, 
  atualizarUsuario, 
  deletarUsuario,
  enviarDocumentacao ,
  getDadosUsuario
} from "../controllers/UsuarioController.js";
import { denunciarUsuario } from "../controllers/DenunciaUsuarioController.js";
import { uploadDocumento } from "../config/multer.js";
import { NotificacaoModel } from "../models/NotificacaoModel.js"; // Importação necessária para as rotas de notificação

const router = express.Router();

// --- 1. Rotas de Gerenciamento de Conta ---
router.get("/:id/dados", getDadosUsuario);
router.post("/cadastrar", cadastrarUsuario);
router.post("/login", loginUsuario);
router.put("/perfil/:id", atualizarUsuario);
router.delete("/excluir/:id", deletarUsuario);
// --- 2. RF03: Envio de Documentação (ONGs e Protetores) ---
/**
 * @route   PUT /usuarios/enviar-documentacao/:id
 * @desc    Faz o upload do documento de comprovação (PDF/Imagem)
 */
router.put(
  "/enviar-documentacao/:id", 
  uploadDocumento.single("documento"), 
  enviarDocumentacao
);

// --- 3. RF19/RF20: Rotas de Notificações (O utilizador lê os avisos do Admin) ---
/**
 * @route   GET /usuarios/:id/notificacoes
 * @desc    Lista todas as notificações recebidas pelo usuário (ex: "Sua conta foi ativa")
 */
router.get("/:id/notificacoes", async (req, res) => {
  try {
    const notificacoes = await NotificacaoModel.listarPorUsuario(req.params.id);
    res.json(notificacoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

/**
 * @route   PUT /usuarios/notificacoes/ler/:id
 * @desc    Marca uma notificação específica como lida
 */
router.put("/notificacoes/ler/:id", async (req, res) => {
  try {
    await NotificacaoModel.marcarComoLida(req.params.id);
    res.json({ mensagem: "Notificação marcada como lida." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// --- 4. RF20: Denunciar um perfil de usuário ---
router.post("/denunciar", denunciarUsuario);

export default router;