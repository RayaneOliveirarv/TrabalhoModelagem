import { AdminModel } from "../models/AdminModel.js";
import { UsuarioModel } from "../models/UsuarioModel.js";
import { AnimalModel } from "../models/AnimalModel.js";

// RF19: Gerenciar usuários e AD2: Gerenciar Usuários
export const getPainelGeral = async (req, res) => {
  try {
    const usuarios = await AdminModel.listarTodosUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// RF19 e AD3: Bloquear / Excluir Usuários
export const moderarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await UsuarioModel.excluir(id);
    res.json({ mensagem: "Usuário removido do sistema pelo administrador." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// RF20 e AD6: Excluir Postagens Irregulares
export const moderarAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    await AnimalModel.excluir(id);
    res.json({ mensagem: "Postagem de animal removida por irregularidade." });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// RF03: Permitir o cadastro de ONGs e AD5: Aprovar / Reprovar Divulgação
export const aprovarCadastroONG = async (req, res) => {
  try {
    const { id } = req.params;
    const { decisao } = req.body; // No Postman envie: {"decisao": "Ativo"} ou "Recusado"
    
    // Sincronizado com a função atualizarStatusAtivacao do AdminModel
    await AdminModel.atualizarStatusAtivacao(id, decisao);
    
    res.json({ mensagem: `Status da conta ${id} atualizado para ${decisao} com sucesso!` });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};