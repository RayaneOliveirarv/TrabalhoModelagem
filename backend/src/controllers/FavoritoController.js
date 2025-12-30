import { AnimalModel } from "../models/AnimalModel.js";

export const favoritarAnimal = async (req, res) => {
  try {
    const { adotante_id, animal_id } = req.body;
    await AnimalModel.favoritar(adotante_id, animal_id);
    res.status(201).json({ mensagem: "Animal adicionado aos favoritos" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const listarFavoritos = async (req, res) => {
  try {
    const animais = await AnimalModel.listarFavoritos(req.params.adotanteId);
    res.json(animais);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};