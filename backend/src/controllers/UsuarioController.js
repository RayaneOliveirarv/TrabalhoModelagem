// Importa a camada de Serviço que contém as regras de negócio e validações pesadas
import { UsuarioService } from "../services/UsuarioService.js";

/**
 * RF01: Cadastro de Usuário
 * Transforma os dados brutos do formulário em um novo registro no sistema.
 */
export const cadastrarUsuario = async (req, res) => {
  try {
    // Envia os dados (nome, email, senha, tipo, etc.) para o Service processar
    const result = await UsuarioService.cadastrar(req.body);

    // Retorna 201 (Criado) e o ID do novo usuário para o front-end
    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuarioId: result.insertId
    });
  } catch (err) {
    // Tratamento específico: Se o erro for de email duplicado, retorna 409 (Conflito)
    if (err.message.includes("Email")) {
      return res.status(409).json({ erro: err.message });
    }
    // Para outros erros de validação, retorna 400 (Bad Request)
    res.status(400).json({ erro: err.message });
  }
};

/**
 * RF03: Enviar Documentação de Verificação (Apenas para ONGs e Protetores)
 * Este método é essencial para que o Admin possa validar a identidade da entidade.
 */
export const enviarDocumentacao = async (req, res) => {
  try {
    const { id } = req.params; // ID do usuário que está enviando o documento
    
    // O middleware Multer processa o arquivo e o coloca em 'req.file'
    if (!req.file) {
      return res.status(400).json({ erro: "Por favor, selecione um arquivo (PDF ou Imagem) para enviar." });
    }

    // Pega o caminho onde o arquivo foi salvo no servidor (ex: uploads/documentos/DOC-123.pdf)
    const documentoUrl = req.file.path;

    // O Service decide em qual tabela (ongs ou protetores) salvar este caminho baseado no ID
    await UsuarioService.salvarDocumentoVerificacao(id, documentoUrl);

    res.json({ 
      mensagem: "Documentação enviada com sucesso! O Administrador irá analisar para ativar sua conta.",
      arquivo: documentoUrl 
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

/**
 * Login de Usuário
 * Verifica credenciais e, se corretas, retorna os dados básicos do usuário.
 */
export const loginUsuario = async (req, res) => {
  try {
    // O Service valida a senha (provavelmente usando bcrypt) e o email
    const usuario = await UsuarioService.login(req.body);
    res.json(usuario);
  } catch (err) {
    // 401 (Não autorizado) caso o email ou senha estejam incorretos
    res.status(401).json({ erro: err.message });
  }
};

/**
 * Atualizar Perfil de Usuário
 * Permite mudar dados como telefone, endereço ou descrição.
 */
export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    // Separa o 'tipo' (ADOTANTE, ONG, etc) dos demais dados
    const { tipo, ...dados } = req.body; 
    
    // O Service atualiza tanto a tabela 'usuarios' quanto a tabela específica do perfil
    await UsuarioService.editarPerfil(id, tipo, dados);
    res.json({ mensagem: "Perfil atualizado com sucesso" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

/**
 * Excluir Conta
 * Remove permanentemente o usuário e seus dados vinculados.
 */
export const deletarUsuario = async (req, res) => {
  try {
    // Chama a exclusão lógica ou física no Service
    await UsuarioService.deletarConta(req.params.id);
    res.json({ mensagem: "Conta excluída com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

export const getDadosUsuario = async (req,res)=>{
  try{
    const dados = await UsuarioService.getDadosUsuario(req.params.id);
    console.log("retorno dados: ",dados);
    res.json({dados_usr:dados});
  }
  catch(err)
  {
    res.status(500).json({ erro: err.message });
  }
}