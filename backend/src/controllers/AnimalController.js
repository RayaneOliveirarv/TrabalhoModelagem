import { AnimalService } from "../services/AnimalService.js";
import { AnimalModel } from "../models/AnimalModel.js"; 
import db from "../config/db.js";

export const cadastrarAnimal = async (req, res) => {
  try {
    const { ong_id, protetor_id } = req.body;
    const usuarioId = ong_id || protetor_id;

    // RF03/RF04: Verifica se a conta está ativa antes de permitir o cadastro
    const [usuarios] = await db.promise().query(
      "SELECT status_conta FROM usuarios WHERE id = ?", [usuarioId]
    );

    if (!usuarios[0] || usuarios[0].status_conta.toLowerCase() !== 'ativo') {
      return res.status(403).json({ 
        erro: "A tua conta ainda está pendente de aprovação ou está bloqueada." 
      });
    }

    const result = await AnimalService.cadastrar(req.body);
    res.status(201).json({
      mensagem: "Animal cadastrado com sucesso",
      animalId: result.insertId
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const listarAnimais = async (req, res) => {
  try {
    // RF06: Captura filtros da URL (ex: ?porte=Grande&especie=Cão)
    const animais = await AnimalModel.buscarAvancada(req.query);
    res.json(animais);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

export const buscarAnimalPorId = async (req, res) => {
  try {
    const animal = await AnimalModel.buscarPorId(req.params.id);
    if (!animal) return res.status(404).json({ mensagem: "Animal não encontrado" });
    res.json(animal);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

export const atualizarAnimal = async (req, res) => {
  try {
    await AnimalModel.atualizar(req.params.id, req.body);
    res.json({ mensagem: "Informações atualizadas com sucesso!" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const deletarAnimal = async (req, res) => {
  try {
    await AnimalModel.excluir(req.params.id);
    res.json({ mensagem: "Animal removido do sistema." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Métodos de Favoritos (RF08)
export const favoritarAnimal = async (req, res) => {
  try {
    const { adotante_id, animal_id } = req.body;
    await AnimalModel.favoritar(adotante_id, animal_id);
    res.status(201).json({ mensagem: "Adicionado aos favoritos" });
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

export const desfavoritarAnimal = async (req, res) => {
  try {
    const { adotanteId, animalId } = req.params;
    await AnimalModel.desfavoritar(adotanteId, animalId);
    res.json({ mensagem: "Removido dos favoritos" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};