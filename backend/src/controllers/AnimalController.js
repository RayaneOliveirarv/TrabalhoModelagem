import { AnimalService } from "../services/AnimalService.js";
import { AnimalModel } from "../models/AnimalModel.js"; 
import db from "../config/db.js"; // Import direto para a trava de segurança

export const cadastrarAnimal = async (req, res) => {
  try {
    const { ong_id, protetor_id } = req.body;
    const usuarioId = ong_id || protetor_id;

    // RF03/RF04: Bloqueio de segurança - Verifica se a conta está ativa
    const [usuarios] = await db.promise().query(
      "SELECT status_conta FROM usuarios WHERE id = ?", [usuarioId]
    );

    if (!usuarios[0] || usuarios[0].status_conta !== 'Ativo') {
      return res.status(403).json({ 
        erro: "A tua conta ainda está pendente de aprovação ou está bloqueada. Não podes cadastrar animais." 
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
    const animais = await AnimalService.listarDisponiveis();
    res.json(animais);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

export const buscarAnimalPorId = async (req, res) => {
  try {
    const animal = await AnimalService.buscarPorId(req.params.id);
    if (!animal) return res.status(404).json({ mensagem: "Animal não encontrado" });
    res.json(animal);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

export const atualizarAnimal = async (req, res) => {
  try {
    await AnimalModel.atualizar(req.params.id, req.body);
    res.json({ mensagem: "Informações do animal atualizadas com sucesso!" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const deletarAnimal = async (req, res) => {
  try {
    await AnimalModel.excluir(req.params.id);
    res.json({ mensagem: "Animal removido do sistema com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};