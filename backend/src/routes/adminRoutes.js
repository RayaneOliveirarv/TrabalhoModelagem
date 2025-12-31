import express from "express";
import { 
    getPainelGeral, 
    moderarUsuario, 
    moderarAnimal, 
    aprovarCadastroONG 
} from "../controllers/AdminController.js";

const router = express.Router();

// Painel de Administração
router.get("/usuarios", getPainelGeral); 

// RF19: Bloquear usuário enviando { "acao": "Bloqueado", "motivo": "Texto aqui" }
router.put("/usuario/moderar/:id", moderarUsuario); 

// RF03: Aprovar ONG
router.put("/aprovar-ong/:id", aprovarCadastroONG); 

// RF20: Remover postagem irregular
router.delete("/animal/:id", moderarAnimal);

export default router;