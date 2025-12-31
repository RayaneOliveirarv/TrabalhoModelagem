import db from "../config/db.js";

/**
 * UsuarioModel: Gerencia a autenticação, segurança e integridade das contas.
 */
export const UsuarioModel = {
  
  // RF01: Cria o registro básico de acesso (Login e Senha)
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

  // Essencial para o processo de Login e para evitar emails duplicados no cadastro
  buscarPorEmail(email) {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [email], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  // Utilizado em fluxos de "Esqueci minha senha" ou alteração de perfil
  atualizarSenha(id, novaSenha) {
    const sql = `UPDATE usuarios SET senha = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [novaSenha, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  /**
   * MÉTODO DINÂMICO: Atualiza detalhes em tabelas específicas.
   * @param {string} tabela - Nome da tabela (adotantes, ongs, etc)
   * @param {object} dados - Objeto contendo {coluna: valor}
   */
  atualizarDetalhes(tabela, dados, usuarioId) {
    // Transforma o objeto {nome: "João"} em "nome = ?"
    const campos = Object.keys(dados).map(key => `${key} = ?`).join(", ");
    const valores = [...Object.values(dados), usuarioId];
    
    // IMPORTANTE: Embora os valores sejam protegidos por '?', 
    // o nome da tabela deve ser validado no Service para evitar injeção.
    const sql = `UPDATE ${tabela} SET ${campos} WHERE usuario_id = ?`;
    
    return new Promise((resolve, reject) => {
      db.query(sql, valores, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // RF02: Exclusão de conta (Atenção: o banco usa ON DELETE CASCADE no seu schema)
  excluir(id) {
    const sql = `DELETE FROM usuarios WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  /**
   * RF19: Controle de Moderação.
   * Altera se o usuário pode ou não logar no sistema.
   */
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