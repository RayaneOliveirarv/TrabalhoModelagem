import db from "../config/db.js";

export const FormularioModel = {
  // RF10: Cria um novo formulário
  criar(dados) {
    const sql = `
      INSERT INTO formularios_adocao
      (adotante_id, animal_id, dados_adotante, justificativa, status, data_envio)
      VALUES (?, ?, ?, ?, 'Enviado', NOW())
    `;

    const detalhesAdotante = JSON.stringify({
      experiencia: dados.experiencia,
      ambiente: dados.ambiente,
      motivacao: dados.motivacao,
      residencia: dados.tipo_residencia
    });

    return new Promise((resolve, reject) => {
      db.query(
        sql,
        [dados.adotante_id, dados.animal_id, detalhesAdotante, dados.justificativa || "Interesse na adoção"],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },

  buscarPorId(id) {
    const sql = `SELECT * FROM formularios_adocao WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  // ESTA FUNÇÃO RESOLVE O ERRO "o.telefone"
  buscarDadosParaPdf(id) {
    const sql = `
      SELECT 
        f.id AS formulario_id,
        u_adotante.nome AS adotante_nome,
        u_adotante.cpf AS adotante_cpf,
        a.nome AS animal_nome,
        a.especie AS animal_especie,
        o.nome AS ong_nome,
        o.contato AS ong_contato -- MUDADO: o.telefone não existe, usamos o.contato
      FROM formularios_adocao f
      JOIN adotantes u_adotante ON f.adotante_id = u_adotante.usuario_id
      JOIN animais_adocao a ON f.animal_id = a.id
      JOIN ongs o ON a.ong_id = o.usuario_id
      WHERE f.id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  atualizarStatus(id, status) {
    const sql = `UPDATE formularios_adocao SET status = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [status, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  salvarCaminhoDocumento(formularioId, caminho) {
    const sql = `UPDATE formularios_adocao SET documento_caminho = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [caminho, formularioId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};