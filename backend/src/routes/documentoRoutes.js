import express from "express";
import {
  gerarDocumentoAdocao,
  baixarDocumento
} from "../controllers/documentoController.js";

const router = express.Router();

router.post("/gerar/:documentoId", gerarDocumentoAdocao);
router.get("/download/:nome", baixarDocumento);

export default router;
