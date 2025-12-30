import express from "express";
import { 
  cadastrarAnimal, 
  listarAnimais, 
  buscarAnimalPorId,
  atualizarAnimal,
  deletarAnimal 
} from "../controllers/AnimalController.js";
import { favoritarAnimal, listarFavoritos } from "../controllers/FavoritoController.js";

const router = express.Router();

// Rotas baseadas em /animais
router.post("/", cadastrarAnimal);         // POST http://localhost:3000/animais/
router.get("/", listarAnimais);           // GET  http://localhost:3000/animais/
router.get("/:id", buscarAnimalPorId);    // GET  http://localhost:3000/animais/1
router.put("/:id", atualizarAnimal);      // PUT  http://localhost:3000/animais/1
router.delete("/:id", deletarAnimal);   // DELETE http://localhost:3000/animais/1

// Rotas de favoritos (sub-recurso)
router.post("/favoritos", favoritarAnimal);             // POST http://localhost:3000/animais/favoritos
router.get("/favoritos/:adotanteId", listarFavoritos);  // GET  http://localhost:3000/animais/favoritos/1

export default router;