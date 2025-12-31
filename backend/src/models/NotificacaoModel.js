import db from "../config/db.js";

export const NotificacaoModel = {
  // Criar uma nova notificação para um utilizador
  criar(usuarioId, titulo, mensagem, tipo = 'INFORMATIVO') {
    const sql = `INSERT INTO notificacoes (usuario_id, titulo, mensagem, tipo) VALUES (?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
      db.query(sql, [usuarioId, titulo, mensagem, tipo], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Listar notificações de um utilizador específico
  listarPorUsuario(usuarioId) {
    const sql = `SELECT * FROM notificacoes WHERE usuario_id = ? ORDER BY data_criacao DESC`;
    return new Promise((resolve, reject) => {
      db.query(sql, [usuarioId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  // Marcar como lida
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