import express from "express";
import { 
    getPainelGeral, 
    moderarUsuario, 
    moderarAnimal, 
    aprovarCadastroONG,
    listarDenunciasUsuarios 
} from "../controllers/AdminController.js";

const router = express.Router();

/**
 * RF19: Painel de Administração - Gestão de Contas
 * Rota para listar todos os utilizadores e o estado atual das suas contas.
 */
router.get("/usuarios", getPainelGeral);

/**
 * RF20: Moderação de Perfis
 * Rota para o Admin visualizar todas as denúncias enviadas por utilizadores contra outros perfis.
 */
router.get("/denuncias-usuarios", listarDenunciasUsuarios);

/**
 * RF19: Ação de Moderação (Bloquear/Ativar)
 * Usa PUT pois estamos a atualizar o estado ('status_conta') e a justificativa ('motivo_status') de um utilizador.
 * Exemplo de corpo: { "status": "Bloqueado", "motivo": "Uso indevido da plataforma" }
 */
router.put("/usuarios/:id/moderar", moderarUsuario);

/**
 * RF03: Validação de Credenciais (ONGs e Protetores)
 * Rota específica para o Admin validar os documentos enviados e ativar a conta de uma instituição.
 */
router.put("/aprovar-ong/:id", aprovarCadastroONG);

/**
 * RF20: Limpeza de Conteúdo Irregular
 * Rota para remover permanentemente um animal que viole as regras (ex: venda de animais, fotos falsas).
 */
router.delete("/animal/:id", moderarAnimal);

export default router;