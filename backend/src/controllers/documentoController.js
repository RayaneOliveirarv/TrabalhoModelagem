// Importação dos serviços de PDF, modelos de formulário e utilitários de sistema de arquivos
import { DocumentoService } from "../services/DocumentoService.js";
import { FormularioModel } from "../models/FormularioModel.js";
import path from "path";
import fs from "fs";
import db from "../config/db.js"; 

/**
 * RF15: Gerar Documento de Adoção
 * Transforma os dados de um formulário aprovado em um arquivo PDF oficial.
 */
export const gerarDocumentoAdocao = async (req, res) => {
  try {
    // Pega o ID do formulário que vem na rota (ex: /documento/gerar/10)
    const { formularioId } = req.params;
    
    // 1. Busca os dados formatados (adotante, animal e responsável) no banco de dados.
    // O Model aqui faz um 'JOIN' para reunir todas as informações necessárias para o texto do PDF.
    const dados = await FormularioModel.buscarDadosParaPdf(formularioId);
    
    if (!dados) {
      return res.status(404).json({ erro: "Dados para o formulário não encontrados no banco de dados." });
    }

    // 2. Chama o Service especializado em PDF para criar o arquivo físico.
    // O PDF é salvo na pasta '/uploads/documentos' e o método retorna o caminho onde ele foi guardado.
    const caminhoRelativo = await DocumentoService.gerarTermoAdocao(dados);
    
    // 3. Registra no banco de dados o caminho do arquivo gerado.
    // Isso é importante para que o sistema saiba onde buscar o arquivo futuramente.
    await FormularioModel.salvarCaminhoDocumento(formularioId, caminhoRelativo);

    res.json({ 
      mensagem: "Termo de Responsabilidade gerado com sucesso!", 
      caminho: caminhoRelativo 
    });
  } catch (err) {
    // Erros aqui podem ser falhas de permissão de escrita em disco ou erro na consulta SQL
    res.status(500).json({ erro: err.message });
  }
};

/**
 * RF16 & A11: Download do Documento
 * Localiza o arquivo PDF no servidor e o envia para o navegador do usuário.
 */
export const baixarDocumento = async (req, res) => {
  try {
    const { formularioId } = req.params;

    // 1. Consulta o banco de dados para descobrir onde o arquivo foi salvo
    const [resultado] = await db.promise().query(
      "SELECT documento_caminho FROM formularios_adocao WHERE id = ?", 
      [formularioId]
    );

    const caminhoNoBanco = resultado[0]?.documento_caminho;

    // Se a coluna estiver vazia, significa que o PDF ainda não foi gerado pela função acima
    if (!caminhoNoBanco) {
      return res.status(404).json({ erro: "O PDF ainda não foi gerado para este formulário." });
    }

    // 2. Transforma o caminho relativo (do banco) em um caminho absoluto (do sistema operacional).
    // Isso é essencial para que o Node.js encontre o arquivo no disco rígido do servidor.
    const caminhoAbsoluto = path.resolve(caminhoNoBanco);

    // 3. Verificação de segurança: checa se o arquivo realmente existe na pasta 'uploads'
    if (fs.existsSync(caminhoAbsoluto)) {
      // res.download é uma função do Express que configura os cabeçalhos HTTP
      // para que o navegador entenda que deve baixar o arquivo, e não apenas abri-lo.
      res.download(caminhoAbsoluto, (err) => {
        if (err) {
          // Caso a conexão caia durante o download, evitamos enviar resposta duplicada
          if (!res.headersSent) {
            res.status(500).json({ erro: "Erro ao processar o download do ficheiro." });
          }
        }
      });
    } else {
      // Caso o arquivo tenha sido deletado manualmente do servidor
      res.status(404).json({ 
        erro: "O arquivo PDF foi removido do servidor ou o caminho está incorreto." 
      });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};