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
    const animais = await AnimalService.listarComFiltros(req.query);
    res.json(animais);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// RF07: Visualizar Detalhes de um Animal Específico
export const buscarAnimalPorId = async (req, res) => {
  try {
    const animal = await AnimalService.buscarPorId(req.params.id);
    res.json(animal);
  } catch (err) {
    res.status(404).json({ erro: err.message });
  }
};

/**
 * Atualização de Animal (RF20 / Edição pelo dono)
 * ATUALIZADO: Agora utiliza o AnimalService para validar a propriedade do animal
 */
export const atualizarAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id, ...outrosDados } = req.body; // Extraímos o usuario_id para validar a posse

    if (!usuario_id) {
      return res.status(401).json({ erro: "É necessário informar o ID do usuário para editar." });
    }

    const usuario = await obterInfoUsuario(usuario_id);
    if (!usuario || usuario.status_conta.toLowerCase() !== 'ativo') {
      return res.status(403).json({ erro: "Ação bloqueada: conta inativa ou bloqueada." });
    }

    const dadosAtualizados = { ...outrosDados };
    
    // Se um novo arquivo de imagem for enviado, atualizamos o caminho
    if (req.file) {
      dadosAtualizados.foto_url = `uploads/animais/${req.file.filename}`;
    }

    // Chamamos o SERVICE que agora faz a checagem se o usuario_id é dono do animal 'id'
    await AnimalService.atualizarDados(id, dadosAtualizados, usuario_id);
    
    res.json({ mensagem: "Informações do animal atualizadas com sucesso!" });
  } catch (err) {
    // Se o erro for de permissão lançado pelo Service, retornamos 403
    const status = err.message.includes("permissão") ? 403 : 400;
    res.status(status).json({ erro: err.message });
  }
};

/**
 * Remoção de Animal (RF20 / Exclusão pelo dono)
 * ATUALIZADO: Agora utiliza o AnimalService para garantir que apenas o dono exclua
 */
export const deletarAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id } = req.body; 

    if (!usuario_id) {
      return res.status(401).json({ erro: "É necessário informar o ID do usuário para excluir." });
    }

    const usuario = await obterInfoUsuario(usuario_id);
    if (!usuario || usuario.status_conta.toLowerCase() !== 'ativo') {
      return res.status(403).json({ erro: "Ação bloqueada: conta inativa ou bloqueada." });
    }

    // Chamamos o SERVICE para validar a posse e excluir
    await AnimalService.excluirAnimal(id, usuario_id);
    
    res.json({ mensagem: "Animal removido do sistema com sucesso." });
  } catch (err) {
    const status = err.message.includes("permissão") ? 403 : 500;
    res.status(status).json({ erro: err.message });
  }
};

// ==========================================
// RF08: MÉTODOS DE FAVORITOS
// ==========================================

export const favoritarAnimal = async (req, res) => {
  try {
    const { adotante_id, animal_id } = req.body;
    const usuario = await obterInfoUsuario(adotante_id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

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

export const desfavoritarAnimal = async (req, res) => {
  try {
    const { adotanteId, animalId } = req.params;
    const usuario = await obterInfoUsuario(adotanteId);

    if (!usuario || usuario.status_conta.toLowerCase() === 'bloqueado') {
      return res.status(403).json({ erro: "Ação bloqueada: conta inexistente ou bloqueada." });
    }

    await AnimalModel.desfavoritar(adotanteId, animalId);
    res.json({ mensagem: "Animal removido dos favoritos." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};