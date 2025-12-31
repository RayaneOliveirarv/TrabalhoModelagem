import db from "../config/db.js";

/**
 * NotificacaoModel: Gerencia os alertas e mensagens do sistema para os utilizadores.
 * Essencial para o RF19 (Moderação) e RF12 (Acompanhamento).
 */
export const NotificacaoModel = {
  
  /**
   * Cria um novo alerta para um utilizador específico.
   * @param {number} usuarioId - ID do destinatário.
   * @param {string} titulo - Assunto breve (ex: "Adoção Aprovada!").
   * @param {string} mensagem - Conteúdo detalhado da notificação.
   * @param {string} tipo - Categoria do alerta (SUCESSO, ALERTA, ERRO, INFORMATIVO).
   */
  criar(usuarioId, titulo, mensagem, tipo = 'INFORMATIVO') {
    const sql = `INSERT INTO notificacoes (usuario_id, titulo, mensagem, tipo) VALUES (?, ?, ?, ?)`;
    
    return new Promise((resolve, reject) => {
      db.query(sql, [usuarioId, titulo, mensagem, tipo], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  /**
   * Busca todas as mensagens de um utilizador, das mais recentes para as mais antigas.
   */
  listarPorUsuario(usuarioId) {
    const sql = `SELECT * FROM notificacoes WHERE usuario_id = ? ORDER BY data_criacao DESC`;
    
    return new Promise((resolve, reject) => {
      db.query(sql, [usuarioId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  /**
   * Atualiza o estado da notificação para que ela não apareça mais como "nova" no sino do sistema.
   */
  marcarComoLida(id) {
    const sql = `UPDATE notificacoes SET lida = TRUE WHERE id = ?`;
    
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};