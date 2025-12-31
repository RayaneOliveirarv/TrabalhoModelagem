import db from "../config/db.js";

export const AdminModel = {
  listarTodosUsuarios() {
    const sql = `SELECT id, email, tipo, status_conta, motivo_status FROM usuarios ORDER BY id DESC`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  // RF19: Atualizar status com motivo obrigatório para bloqueio
  atualizarStatusComMotivo(id, status, motivo) {
    const sql = `UPDATE usuarios SET status_conta = ?, motivo_status = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [status, motivo || null, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // RF20: Lógica para Denúncias
  listarDenuncias() {
    const sql = `
      SELECT d.*, a.nome as animal_nome, u.email as denunciante_email 
      FROM denuncias d
      JOIN animais_adocao a ON d.animal_id = a.id
      JOIN usuarios u ON d.denunciante_id = u.id
      WHERE d.status = 'Pendente'
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
};