import express from "express";
import { 
  enviarFormulario, 
  decidirFormulario, 
  listarSolicitacoesProtetor,
  acompanharStatusAdotante 
} from "../controllers/FormularioController.js";

const router = express.Router();

router.post("/enviar", enviarFormulario);               // RF10 - Enviar proposta
router.put("/decidir/:id", decidirFormulario);          // RF18 - Aprovar/Recusar
router.get("/pendentes", listarSolicitacoesProtetor);   // Ver solicitações recebidas
router.get("/status/:adotanteId", acompanharStatusAdotante); // RF12 - Adotante vê status

export default router;