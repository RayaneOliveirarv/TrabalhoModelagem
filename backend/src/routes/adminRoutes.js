import express from "express";
import { 
    getPainelGeral, 
    moderarUsuario, 
    moderarAnimal, 
    aprovarCadastroONG,
    listarDenunciasUsuarios // Adicionado para listar denúncias de perfis (RF20)
} from "../controllers/AdminController.js";

const router = express.Router();

// Painel de Administração - Listar usuários (RF19)
router.get("/usuarios", getPainelGeral);

// Listar denúncias de perfis pendentes (RF20)
router.get("/denuncias-usuarios", listarDenunciasUsuarios);

// Bloquear usuário enviando { "acao": "Bloqueado", "motivo": "Texto" } (RF19)
router.put("/usuario/moderar/:id", moderarUsuario);

// Aprovar cadastro de ONG (RF03)
router.put("/aprovar-ong/:id", aprovarCadastroONG);

// Remover postagem irregular (RF20)
router.delete("/animal/:id", moderarAnimal);

export default router;