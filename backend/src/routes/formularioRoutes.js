import express from "express";
import { 
  enviarFormulario, 
  decidirFormulario, 
  listarSolicitacoesProtetor,
  acompanharStatusAdotante 
} from "../controllers/FormularioController.js";

const router = express.Router();

router.post("/enviar", enviarFormulario);
router.put("/decidir/:id", decidirFormulario); 
router.get("/pendentes", listarSolicitacoesProtetor);
router.get("/status/:adotanteId", acompanharStatusAdotante);

export default router;