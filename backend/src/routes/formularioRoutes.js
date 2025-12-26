import express from "express";
import { enviarFormulario, aprovarRejeitarFormulario } from "../controllers/FormularioController.js";

const router = express.Router();

router.post("/enviar", enviarFormulario);
router.put("/decidir/:id", aprovarRejeitarFormulario); // PUT para aprovar/rejeitar

export default router;
