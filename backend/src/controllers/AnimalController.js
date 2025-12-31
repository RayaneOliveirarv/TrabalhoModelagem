import { AnimalService } from "../services/AnimalService.js";
import { AnimalModel } from "../models/AnimalModel.js"; 
import db from "../config/db.js";

/**
 * Função auxiliar interna para verificar status e tipo do usuário.
 * Garante que usuários bloqueados ou inativos não realizem ações.
 */
const obterInfoUsuario = async (id) => {
  if (!id) return null;
  const [rows] = await db.promise().query(
    "SELECT status_conta, tipo FROM usuarios WHERE id = ?", 
    [id]
  );
  return rows[0] || null;
};

// RF04 & RF05: Cadastro de Animal com Upload de Foto Real
export const cadastrarAnimal = async (req, res) => {
  try {
    const { ong_id, protetor_id } = req.body;
    const usuarioId = ong_id || protetor_id;

    const usuario = await obterInfoUsuario(usuarioId);

    // RF03/RF04: Verifica se a conta está ativa antes de permitir o cadastro
    if (!usuario || usuario.status_conta.toLowerCase() !== 'ativo') {
      return res.status(403).json({ 
        erro: "A tua conta ainda está pendente de aprovação ou está bloqueada. Não podes cadastrar animais." 
      });
    }

    // RF05: Se o Multer processou um arquivo, salvamos o caminho relativo.
    // Caso contrário, fica como null (o Model/Service pode tratar o padrão).
    const dadosAnimal = {
      ...req.body,
      foto_url: req.file ? `uploads/animais/${req.file.filename}` : null
    };

    const result = await AnimalService.cadastrar(dadosAnimal);
    
    res.status(201).json({
      mensagem: "Animal cadastrado com sucesso",
      animalId: result.insertId,
      foto: dadosAnimal.foto_url
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// RF06: Listagem com filtros dinâmicos (Espécie, Porte, etc.)
export const listarAnimais = async (req, res) => {
  try {
    const animais = await AnimalModel.buscarAvancada(req.query);
    res.json(animais);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// RF07: Visualizar Detalhes de um Animal Específico
export const buscarAnimalPorId = async (req, res) => {
  try {
    const animal = await AnimalModel.buscarPorId(req.params.id);
    if (!animal) return res.status(404).json({ mensagem: "Animal não encontrado" });
    res.json(animal);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Atualização de Animal (Permite mudar dados e enviar nova foto)
export const atualizarAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id } = req.body; // ID de quem está tentando editar
    const usuario = await obterInfoUsuario(usuario_id);

    if (!usuario || usuario.status_conta.toLowerCase() !== 'ativo') {
      return res.status(403).json({ erro: "Ação bloqueada: conta inativa ou bloqueada." });
    }

    const dadosAtualizados = { ...req.body };
    
    // Se um novo arquivo de imagem for enviado no PUT, atualizamos o campo foto_url
    if (req.file) {
      dadosAtualizados.foto_url = `uploads/animais/${req.file.filename}`;
    }

    await AnimalModel.atualizar(id, dadosAtualizados);
    res.json({ mensagem: "Informações do animal atualizadas com sucesso!" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// Remoção de Animal (Moderação ou encerramento)
export const deletarAnimal = async (req, res) => {
  try {
    const { usuario_id } = req.body; 
    const usuario = await obterInfoUsuario(usuario_id);

    if (!usuario || usuario.status_conta.toLowerCase() !== 'ativo') {
      return res.status(403).json({ erro: "Ação bloqueada: conta inativa ou bloqueada." });
    }

    await AnimalModel.excluir(req.params.id);
    res.json({ mensagem: "Animal removido do sistema com sucesso." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// ==========================================
// RF08: MÉTODOS DE FAVORITOS
// ==========================================

// Adiciona um animal à lista de interesse do adotante
export const favoritarAnimal = async (req, res) => {
  try {
    const { adotante_id, animal_id } = req.body;
    const usuario = await obterInfoUsuario(adotante_id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    // Regra de Negócio: Apenas perfis do tipo ADOTANTE podem favoritar
    if (usuario.tipo !== 'ADOTANTE') {
      return res.status(403).json({ erro: "Apenas perfis de Adotantes podem favoritar animais." });
    }

    if (usuario.status_conta.toLowerCase() !== 'ativo') {
      return res.status(403).json({ erro: "Sua conta precisa estar ativa para favoritar animais." });
    }

    await AnimalModel.favoritar(adotante_id, animal_id);
    res.status(201).json({ mensagem: "Animal adicionado aos favoritos com sucesso!" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// Lista todos os favoritos de um adotante específico
export const listarFavoritos = async (req, res) => {
  try {
    const { adotanteId } = req.params;
    const usuario = await obterInfoUsuario(adotanteId);

    if (!usuario || usuario.tipo !== 'ADOTANTE') {
      return res.status(403).json({ erro: "Acesso restrito. Apenas adotantes podem ter favoritos." });
    }

    const animais = await AnimalModel.listarFavoritos(adotanteId);
    res.json(animais);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Remove um animal da lista de favoritos
export const desfavoritarAnimal = async (req, res) => {
  try {
    const { adotanteId, animalId } = req.params;
    const usuario = await obterInfoUsuario(adotanteId);

    // Bloqueia se o usuário não existir ou estiver com a conta bloqueada pelo Admin
    if (!usuario || usuario.status_conta.toLowerCase() === 'bloqueado') {
      return res.status(403).json({ erro: "Ação bloqueada: conta inexistente ou bloqueada." });
    }

    await AnimalModel.desfavoritar(adotanteId, animalId);
    res.json({ mensagem: "Animal removido dos favoritos." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};