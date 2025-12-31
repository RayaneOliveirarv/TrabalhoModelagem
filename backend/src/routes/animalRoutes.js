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

const router = express.Router();

// Rotas de Animais
router.post("/cadastrar", cadastrarAnimal);
router.get("/", listarAnimais); 
router.get("/:id", buscarAnimalPorId);
router.put("/:id", atualizarAnimal);
router.delete("/:id", deletarAnimal);

// Rotas de Favoritos
router.post("/favoritos", favoritarAnimal);
router.get("/favoritos/:adotanteId", listarFavoritos);
router.delete("/favoritos/:adotanteId/:animalId", desfavoritarAnimal);

export default router;