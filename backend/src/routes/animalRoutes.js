import express from "express";
import { 
  cadastrarAnimal, 
  listarAnimais, 
  buscarAnimalPorId,
  atualizarAnimal,
  deletarAnimal,
  favoritarAnimal,
  listarFavoritos,
  desfavoritarAnimal
} from "../controllers/AnimalController.js";
import { uploadAnimal } from "../config/multer.js"; // Importação do middleware de upload

const router = express.Router();

/**
 * @route   POST /animais/cadastrar
 * @desc    Cadastra um novo animal (Adoção ou Perdido)
 * @access  Privado (ONG/Protetor Ativo)
 * @note    Usa uploadAnimal.single("foto") para processar a imagem vinda do form-data
 */
router.post("/cadastrar", uploadAnimal.single("foto"), cadastrarAnimal);

/**
 * @route   GET /animais
 * @desc    Lista todos os animais com filtros (Espécie, Porte, Cidade, etc)
 */
router.get("/", listarAnimais); 

/**
 * @route   GET /animais/:id
 * @desc    Busca detalhes de um animal específico
 */
router.get("/:id", buscarAnimalPorId);

/**
 * @route   PUT /animais/:id
 * @desc    Atualiza dados do animal ou muda status de moderação
 * @note    Também permite atualizar a foto se for enviado um novo arquivo
 */
router.put("/:id", uploadAnimal.single("foto"), atualizarAnimal);

/**
 * @route   DELETE /animais/:id
 * @desc    Remove um animal do sistema (Moderação ou encerramento)
 */
router.delete("/:id", deletarAnimal);

// ==========================================
// ROTAS DE FAVORITOS (RF08)
// ==========================================

/**
 * @route   POST /animais/favoritos
 * @desc    Adiciona um animal à lista de interesses do adotante
 */
router.post("/favoritos", favoritarAnimal);

/**
 * @route   GET /animais/favoritos/:adotanteId
 * @desc    Lista todos os animais favoritados por um adotante específico
 */
router.get("/favoritos/:adotanteId", listarFavoritos);

/**
 * @route   DELETE /animais/favoritos/:adotanteId/:animalId
 * @desc    Remove um animal da lista de favoritos
 */
router.delete("/favoritos/:adotanteId/:animalId", desfavoritarAnimal);

export default router;