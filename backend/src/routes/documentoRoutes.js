import express from "express";
import {
  gerarDocumentoAdocao,
  baixarDocumento
} from "../controllers/documentoController.js";

const router = express.Router();

router.post("/gerar/:formularioId", gerarDocumentoAdocao); // RF15
router.get("/download/:formularioId", baixarDocumento);    // RF16

export default router;