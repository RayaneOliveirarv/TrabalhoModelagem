import { AnimalService } from "../services/AnimalService.js";
import { AnimalModel } from "../models/AnimalModel.js"; 
import db from "../config/db.js";

// Função auxiliar interna para verificar se um utilizador está ativo
const verificarUsuarioAtivo = async (id) => {
  if (!id) return false;
  const [rows] = await db.promise().query(
    "SELECT status_conta FROM usuarios WHERE id = ?", 
    [id]
  );
  return rows[0] && rows[0].status_conta.toLowerCase() === 'ativo';
};

export const cadastrarAnimal = async (req, res) => {
  try {
    const { ong_id, protetor_id } = req.body;
    const usuarioId = ong_id || protetor_id;

    // RF03/RF04: Verifica se a conta está ativa antes de permitir o cadastro
    if (!(await verificarUsuarioAtivo(usuarioId))) {
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
    const { usuario_id } = req.body; // ID de quem está a tentar editar

    if (!(await verificarUsuarioAtivo(usuario_id))) {
      return res.status(403).json({ erro: "Ação bloqueada: conta inativa ou bloqueada." });
    }

    await AnimalModel.atualizar(req.params.id, req.body);
    res.json({ mensagem: "Informações atualizadas com sucesso!" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

export const deletarAnimal = async (req, res) => {
  try {
    const { usuario_id } = req.body; // ID de quem está a tentar apagar

    if (!(await verificarUsuarioAtivo(usuario_id))) {
      return res.status(403).json({ erro: "Ação bloqueada: conta inativa ou bloqueada." });
    }

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

    if (!(await verificarUsuarioAtivo(adotante_id))) {
      return res.status(403).json({ erro: "Ação bloqueada: a tua conta não está ativa." });
    }

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

    if (!(await verificarUsuarioAtivo(adotanteId))) {
      return res.status(403).json({ erro: "Ação bloqueada: a tua conta não está ativa." });
    }

    await AnimalModel.desfavoritar(adotanteId, animalId);
    res.json({ mensagem: "Removido dos favoritos" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};