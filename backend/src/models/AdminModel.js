import db from "../config/db.js";

/**
 * Objeto AdminModel: Concentra as operações de banco de dados 
 * exclusivas para o painel administrativo.
 */
export const AdminModel = {
  
  /**
   * Lista todos os usuários cadastrados.
   * Utilizado para dar uma visão geral ao administrador sobre quem está no sistema.
   */
  listarTodosUsuarios() {
    // Selecionamos campos específicos, incluindo o motivo do status (importante para auditoria)
    const sql = `SELECT id, email, tipo, status_conta, motivo_status FROM usuarios ORDER BY id DESC`;
    
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err); // Se houver erro de sintaxe ou conexão, rejeita a Promise
        else resolve(results); // Se der certo, retorna a lista de usuários
      });
    });
  },

  /**
   * RF19: Atualizar status salvando a justificativa obrigatória.
   * Este método altera se um usuário está 'Ativo', 'Bloqueado' ou 'Pendente'.
   */
  atualizarStatusComMotivo(id, status, motivo) {
    // Usamos '?' como placeholders para evitar ataques de SQL Injection
    const sql = `UPDATE usuarios SET status_conta = ?, motivo_status = ? WHERE id = ?`;
    
    return new Promise((resolve, reject) => {
      // O driver mysql2 substitui os '?' pelos valores do array abaixo na ordem correta
      db.query(sql, [status, motivo, id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  /**
   * RF20: Listar denúncias recebidas contra perfis de usuários.
   * Este é um SQL mais complexo que utiliza JOIN para buscar dados de três tabelas diferentes.
   */
  listarDenunciasUsuarios() {
    const sql = `
      SELECT d.*, 
             u_denunciado.email as email_denunciado, 
             u_denunciante.email as email_denunciante
      FROM denuncias_usuarios d
      -- JOIN 1: Pega o email da pessoa que foi denunciada
      JOIN usuarios u_denunciado ON d.usuario_denunciado_id = u_denunciado.id
      -- JOIN 2: Pega o email da pessoa que fez a denúncia
      JOIN usuarios u_denunciante ON d.denunciante_id = u_denunciante.id
      -- Filtra para mostrar apenas o que o admin ainda não resolveu
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