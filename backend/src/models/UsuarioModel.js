import db from "../config/db.js";

export const UsuarioModel = {
  // Cria um novo usuário
  criar(email, senha, tipo) {
    const sql = `
      INSERT INTO usuarios (email, senha, tipo)
      VALUES (?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [email, senha, tipo], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Busca um usuário pelo email
  buscarPorEmail(email) {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [email], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  // Atualiza a senha de um usuário
  atualizarSenha(id, novaSenha) {
    const sql = `UPDATE usuarios SET senha = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [novaSenha, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Atualiza detalhes específicos em uma tabela (adotantes, ongs ou protetores)
  atualizarDetalhes(tabela, dados, usuarioId) {
    const campos = Object.keys(dados).map(key => `${key} = ?`).join(", ");
    const valores = [...Object.values(dados), usuarioId];
    const sql = `UPDATE ${tabela} SET ${campos} WHERE usuario_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, valores, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Exclui um usuário pelo id
  excluir(id) {
    const sql = `DELETE FROM usuarios WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Atualiza o status de ativação de um usuário ('Pendente', 'Ativo', 'Bloqueado')
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
