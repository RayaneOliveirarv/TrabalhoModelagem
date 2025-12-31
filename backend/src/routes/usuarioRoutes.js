import express from "express";
import { 
  cadastrarUsuario, 
  loginUsuario, 
  atualizarUsuario, 
  deletarUsuario,
  enviarDocumentacao // Nova função adicionada ao Controller
} from "../controllers/UsuarioController.js";
import { denunciarUsuario } from "../controllers/DenunciaUsuarioController.js";
import { uploadDocumento } from "../config/multer.js"; // Importando o novo middleware de upload

const router = express.Router();

// --- Rotas de Gerenciamento de Conta ---
router.post("/cadastrar", cadastrarUsuario);
router.post("/login", loginUsuario);
router.put("/perfil/:id", atualizarUsuario);
router.delete("/excluir/:id", deletarUsuario);

// --- RF03: Envio de Documentação para ONGs e Protetores ---
/**
 * @route   PUT /usuarios/enviar-documentacao/:id
 * @desc    Faz o upload do PDF ou Imagem de comprovação da ONG/Protetor
 * @access  Privado (Pendente/Ativo)
 */
router.put(
  "/enviar-documentacao/:id", 
  uploadDocumento.single("documento"), 
  enviarDocumentacao
);

// --- RF20: Denunciar um perfil de usuário ---
router.post("/denunciar", denunciarUsuario);

export default router;