import express from "express";
import { 
  cadastrarUsuario, 
  loginUsuario, 
  atualizarUsuario, 
  deletarUsuario 
} from "../controllers/UsuarioController.js";

const router = express.Router();

router.post("/cadastrar", cadastrarUsuario); // RF01
router.post("/login", loginUsuario);         // RF02
router.put("/perfil/:id", atualizarUsuario); // Editar dados (Nome, Tel, etc)
router.delete("/excluir/:id", deletarUsuario); // Excluir conta

export default router;