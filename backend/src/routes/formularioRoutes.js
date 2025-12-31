import express from "express";
import { 
  enviarFormulario, 
  decidirFormulario, 
  listarSolicitacoesProtetor,
  acompanharStatusAdotante 
} from "../controllers/FormularioController.js";

const router = express.Router();

/**
 * RF10: Enviar Proposta de Adoção
 * Rota usada pelo Adotante ao preencher o questionário de interesse.
 * Espera um corpo (body) com: animal_id, adotante_id, experiencia, ambiente, etc.
 */
router.post("/enviar", enviarFormulario);

/**
 * RF18: Decisão do Protetor (Aprovar ou Recusar)
 * O ':id' na URL refere-se ao ID do formulário.
 * No corpo da requisição, deve-se enviar { "decisao": "Aprovado" } ou "Rejeitado".
 */
router.put("/decidir/:id", decidirFormulario);

/**
 * RF18: Painel de Gestão para Protetores/ONGs
 * Rota para listar todos os pedidos recebidos. 
 * Geralmente usada com query strings, ex: /pendentes?tipo=ong_id&id=5
 */
router.get("/pendentes", listarSolicitacoesProtetor);

/**
 * RF12: Acompanhamento pelo Adotante
 * Rota usada na área "Meus Pedidos" do adotante para verificar se foi aprovado ou não.
 */
router.get("/status/:adotanteId", acompanharStatusAdotante);

export default router;