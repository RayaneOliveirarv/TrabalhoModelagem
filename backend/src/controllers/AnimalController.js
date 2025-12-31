// Importação da camada de Serviço (lógica complexa) e do Model (acesso direto aos dados)
import { AnimalService } from "../services/AnimalService.js";
import { AnimalModel } from "../models/AnimalModel.js"; 
import db from "../config/db.js";

/**
 * FUNÇÃO AUXILIAR: Não é exportada.
 * Serve para verificar no banco se o usuário está 'Ativo' ou 'Bloqueado'
 * antes de permitir que ele faça qualquer alteração no sistema.
 */
const obterInfoUsuario = async (id) => {
  if (!id) return null;
  // Usa o db.promise() para permitir o uso de async/await em consultas manuais
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
    // O animal pode pertencer a uma ONG ou a um Protetor independente
    const usuarioId = ong_id || protetor_id;

    const usuario = await obterInfoUsuario(usuarioId);

    // Regra de Negócio: Se a conta não estiver 'Ativo', impede o cadastro
    if (!usuario || usuario.status_conta.toLowerCase() !== 'ativo') {
      return res.status(403).json({ 
        erro: "A tua conta ainda está pendente de aprovação ou está bloqueada. Não podes cadastrar animais." 
      });
    }

    // RF05: Monta o objeto do animal. 
    // Se o Multer enviou um arquivo (req.file), salvamos o caminho da imagem no banco.
    const dadosAnimal = {
      ...req.body,
      foto_url: req.file ? `uploads/animais/${req.file.filename}` : null
    };

    // Delega a inserção para o Service
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

// RF06: Listagem com filtros dinâmicos (Busca por Espécie, Porte, etc.)
export const listarAnimais = async (req, res) => {
  try {
    // req.query contém os parâmetros da URL (ex: ?especie=Cao&porte=Medio)
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
 * RF20 / Edição: Atualização de dados do animal
 * Verifica se o usuário que está tentando editar é realmente o dono do animal.
 */
export const atualizarAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id, ...outrosDados } = req.body; 

    if (!usuario_id) {
      return res.status(401).json({ erro: "É necessário informar o ID do usuário para editar." });
    }

    const usuario = await obterInfoUsuario(usuario_id);
    if (!usuario || usuario.status_conta.toLowerCase() !== 'ativo') {
      return res.status(403).json({ erro: "Ação bloqueada: conta inativa ou bloqueada." });
    }

    const dadosAtualizados = { ...outrosDados };
    
    // Se uma nova foto foi enviada no upload, atualiza o campo foto_url
    if (req.file) {
      dadosAtualizados.foto_url = `uploads/animais/${req.file.filename}`;
    }

    // O Service valida internamente se o usuario_id tem permissão sobre este animal 'id'
    await AnimalService.atualizarDados(id, dadosAtualizados, usuario_id);
    
    res.json({ mensagem: "Informações do animal atualizadas com sucesso!" });
  } catch (err) {
    const status = err.message.includes("permissão") ? 403 : 400;
    res.status(status).json({ erro: err.message });
  }
};

/**
 * Remoção de Animal
 * Garante que apenas o dono (ou admin via Service) possa excluir o anúncio.
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

    // Chama o Service para validar a posse e realizar a exclusão
    await AnimalService.excluirAnimal(id, usuario_id);
    
    res.json({ mensagem: "Animal removido do sistema com sucesso." });
  } catch (err) {
    const status = err.message.includes("permissão") ? 403 : 500;
    res.status(status).json({ erro: err.message });
  }
};

// ==========================================
// RF08: MÉTODOS DE FAVORITOS (Interação do Adotante)
// ==========================================

export const favoritarAnimal = async (req, res) => {
  try {
    const { adotante_id, animal_id } = req.body;
    const usuario = await obterInfoUsuario(adotante_id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    // Regra de Negócio: Apenas ADOTANTES podem favoritar, ONGs/Protetores não.
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

    // Verifica se o usuário existe e não está bloqueado antes de permitir desfavoritar
    if (!usuario || usuario.status_conta.toLowerCase() === 'bloqueado') {
      return res.status(403).json({ erro: "Ação bloqueada: conta inexistente ou bloqueada." });
    }

    await AnimalModel.desfavoritar(adotanteId, animalId);
    res.json({ mensagem: "Animal removido dos favoritos." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};