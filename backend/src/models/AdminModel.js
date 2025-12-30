import db from "../config/db.js";

export const AdminModel = {
  // RF19 e AD2: Listar usuários
  listarTodosUsuarios() {
    // Agora incluindo a coluna status_conta que você acabou de criar
    const sql = `SELECT id, email, tipo, status_conta FROM usuarios ORDER BY id DESC`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  // RF03 e AD3: Atualizar status (Ativo/Bloqueado/Pendente)
  atualizarStatusAtivacao(id, status) {
    const sql = `UPDATE usuarios SET status_conta = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [status, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};