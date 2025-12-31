import express from "express";
import { 
  cadastrarUsuario, 
  loginUsuario, 
  atualizarUsuario, 
  deletarUsuario 
} from "../controllers/UsuarioController.js";
import { denunciarUsuario } from "../controllers/DenunciaUsuarioController.js"; // Novo controller

const router = express.Router();

router.post("/cadastrar", cadastrarUsuario);
router.post("/login", loginUsuario);
router.put("/perfil/:id", atualizarUsuario);
router.delete("/excluir/:id", deletarUsuario);

// Rota para denunciar um perfil de usuário (RF20)
router.post("/denunciar", denunciarUsuario);

export default router;