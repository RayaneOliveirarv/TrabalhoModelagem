// Importa o Model de Animais, onde estão as funções que falam com o banco de dados
import { AnimalModel } from "../models/AnimalModel.js";

/**
 * RF08: Adicionar um animal à lista de favoritos do adotante.
 * Esta função cria um vínculo entre o usuário e o pet.
 */
export const favoritarAnimal = async (req, res) => {
  try {
    // Extrai os IDs do corpo da requisição (JSON)
    const { adotante_id, animal_id } = req.body;

    // Chama o método no Model para inserir essa relação na tabela de favoritos
    await AnimalModel.favoritar(adotante_id, animal_id);

    // Retorna status 201 (Created) indicando que o recurso foi criado com sucesso
    res.status(201).json({ mensagem: "Animal adicionado aos favoritos" });
  } catch (err) {
    // Caso o usuário tente favoritar o mesmo animal duas vezes (se houver restrição no banco),
    // ou se o animal não existir, o erro será capturado aqui.
    res.status(400).json({ erro: err.message });
  }
};

/**
 * RF08: Listar todos os animais favoritados por um adotante específico.
 */
export const listarFavoritos = async (req, res) => {
  try {
    // Pega o ID do adotante que vem diretamente da URL (ex: /favoritos/15)
    const { adotanteId } = req.params;

    // Busca no banco todos os animais vinculados a esse ID de adotante
    const animais = await AnimalModel.listarFavoritos(adotanteId);

    // Retorna a lista de animais para o front-end exibir na tela de "Meus Favoritos"
    res.json(animais);
  } catch (err) {
    // Erro 500 para falhas inesperadas no servidor ou conexão com o banco
    res.status(500).json({ erro: err.message });
  }
};