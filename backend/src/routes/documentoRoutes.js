import express from "express";
import {
  gerarDocumentoAdocao,
  baixarDocumento
} from "../controllers/documentoController.js"; // Alterado para 'd' minúsculo

const router = express.Router();

// RF15: Gera o documento manualmente se necessário
router.post("/gerar/:formularioId", gerarDocumentoAdocao);

// A11 & RF16: Download do documento pelo ID do formulário
// No Postman: GET http://localhost:3000/documentos/download/1
router.get("/download/:formularioId", baixarDocumento);

export default router;