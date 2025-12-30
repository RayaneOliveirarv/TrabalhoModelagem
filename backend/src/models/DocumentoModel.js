import db from "../config/db.js";

export const DocumentoModel = {
  criar(animalId, adotanteId) {
    const sql = `
      INSERT INTO documentos_adocao (animal_id, adotante_id, data)
      VALUES (?, ?, NOW())
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [animalId, adotanteId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  buscarPorId(id) {
    const sql = `
      SELECT d.id, a.nome AS animal, a.especie, u.email AS adotante
      FROM documentos_adocao d
      JOIN animais_adocao a ON d.animal_id = a.id
      JOIN usuarios u ON d.adotante_id = u.id
      WHERE d.id = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

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
