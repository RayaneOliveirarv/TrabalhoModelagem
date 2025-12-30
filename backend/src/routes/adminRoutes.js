import express from "express";
import { 
    getPainelGeral, 
    moderarUsuario, 
    moderarAnimal, 
    aprovarCadastroONG 
} from "../controllers/AdminController.js";

const router = express.Router();

// RF19: Gerenciar usuários (AD2 no diagrama)
router.get("/usuarios", getPainelGeral); 

// RF03: Aprovar cadastro de ONG (AD3 no diagrama)
// ATENÇÃO: Se aqui estiver "/admin/aprovar-ong", a URL no Postman teria que ser /admin/admin/aprovar-ong
router.put("/aprovar-ong/:id", aprovarCadastroONG); 

// RF19: Bloquear/Excluir usuários (AD3)
router.delete("/usuario/:id", moderarUsuario);

// RF20: Moderar conteúdos/Excluir postagens (AD6)
router.delete("/animal/:id", moderarAnimal);

export default router;