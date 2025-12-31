import db from "../config/db.js";

/**
 * Objeto DocumentoModel: Gerencia a tabela 'documentos_adocao' (ou formularios_adocao conforme o seu schema).
 * Ele serve para registrar o vínculo oficial entre o Adotante e o Animal.
 */
export const DocumentoModel = {
  
  /**
   * Registra uma nova adoção no banco de dados.
   * Geralmente chamado no momento em que o protetor clica em "Aprovar".
   */
  criar(animalId, adotanteId) {
    const sql = `
      INSERT INTO documentos_adocao (animal_id, adotante_id, data)
      VALUES (?, ?, NOW()) -- NOW() insere a data e hora exata da aprovação
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [animalId, adotanteId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  /**
   * RF15/16: Busca dados completos para gerar o PDF ou exibir detalhes.
   * Utiliza JOIN para transformar IDs em nomes legíveis.
   */
  buscarPorId(id) {
    const sql = `
      SELECT d.id, a.nome AS animal, a.especie, u.email AS adotante
      FROM documentos_adocao d
      -- Busca o nome do animal na tabela de animais
      JOIN animais_adocao a ON d.animal_id = a.id
      -- Busca o contato do adotante na tabela de usuários
      JOIN usuarios u ON d.adotante_id = u.id
      WHERE d.id = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]); // Retorna apenas o primeiro (e único) registro encontrado
      });
    });
  },

  /**
   * Atualiza o registro com o nome/caminho do arquivo PDF gerado.
   * Isso permite que o sistema saiba qual ficheiro enviar quando o usuário clicar em "Download".
   */
  salvarArquivo(id, nomeArquivo) {
    const sql = `
      UPDATE documentos_adocao
      SET arquivo_pdf = ?
      WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [nomeArquivo, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};