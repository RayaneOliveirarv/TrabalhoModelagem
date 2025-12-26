import express from "express";
import {
  cadastrarAnimal,
  listarAnimais,
  buscarAnimalPorId
} from "../controllers/AnimalController.js";

const router = express.Router();

router.post("/cadastrar", cadastrarAnimal);
router.get("/", listarAnimais);
router.get("/:id", buscarAnimalPorId);

export default router;
