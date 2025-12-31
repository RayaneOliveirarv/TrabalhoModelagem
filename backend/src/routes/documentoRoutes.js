import express from "express";
import {
  gerarDocumentoAdocao,
  baixarDocumento
} from "../controllers/documentoController.js";

const router = express.Router();

/**
 * RF15: Gerar o Termo de Responsabilidade.
 * Usamos POST porque esta rota dispara um processo de criação de arquivo no servidor.
 * O ':formularioId' identifica qual processo de adoção está a ser finalizado.
 */
router.post("/gerar/:formularioId", gerarDocumentoAdocao);

/**
 * RF16: Download do Documento.
 * Usamos GET porque o objetivo é apenas recuperar um recurso (o arquivo PDF) 
 * que já foi gerado e está armazenado no servidor.
 */
router.get("/download/:formularioId", baixarDocumento);

export default router;