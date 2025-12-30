import express from "express";
import { 
  cadastrarUsuario, 
  loginUsuario, 
  atualizarUsuario, 
  deletarUsuario 
} from "../controllers/UsuarioController.js";

const router = express.Router();

router.post("/cadastrar", cadastrarUsuario); // 
router.post("/login", loginUsuario); // 
router.put("/perfil/:id", atualizarUsuario);
router.delete("/excluir/:id", deletarUsuario);

export default router; //