import db from "../config/db.js";

export const AdminModel = {
  // Lista todos os usuários incluindo status e motivo
  listarTodosUsuarios() {
    const sql = `SELECT id, email, tipo, status_conta, motivo_status FROM usuarios ORDER BY id DESC`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  // RF19: Atualizar status salvando a justificativa obrigatória
  atualizarStatusComMotivo(id, status, motivo) {
    const sql = `UPDATE usuarios SET status_conta = ?, motivo_status = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [status, motivo, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // RF20: Listar denúncias recebidas contra perfis de usuários
  listarDenunciasUsuarios() {
    const sql = `
      SELECT d.*, 
             u_denunciado.email as email_denunciado, 
             u_denunciante.email as email_denunciante
      FROM denuncias_usuarios d
      JOIN usuarios u_denunciado ON d.usuario_denunciado_id = u_denunciado.id
      JOIN usuarios u_denunciante ON d.denunciante_id = u_denunciante.id
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