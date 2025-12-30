import db from "../config/db.js";

export const AnimalModel = {
  // P3 - Cadastrar Animal para Adoção
  criar(dados) {
    const sql = `
      INSERT INTO animais_adocao
      (nome, idade, especie, descricao, localizacao, ong_id, protetor_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Disponivel')
    `;

    return new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          dados.nome,
          dados.idade,
          dados.especie,
          dados.descricao,
          dados.localizacao,
          dados.ong_id || null,
          dados.protetor_id || null
          // O status 'Disponivel' é fixado no SQL para evitar erros de ENUM
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },

  // A4 - Buscar Animais por filtros (Listagem Geral)
  listarDisponiveis() {
    const sql = `
      SELECT id, nome, idade, especie, descricao, localizacao, status
      FROM animais_adocao
      WHERE status = 'Disponivel'
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  // A5 e A14 - Visualizar Detalhes (CORREÇÃO: o.contato e o.nome)
  buscarPorId(id) {
    const sql = `
      SELECT a.*, 
             COALESCE(o.contato, p.contato) as contato_telefone,
             COALESCE(o.nome, p.nome) as dono_nome
      FROM animais_adocao a
      LEFT JOIN ongs o ON a.ong_id = o.usuario_id
      LEFT JOIN protetores_individuais p ON a.protetor_id = p.usuario_id
      WHERE a.id = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  // P5 - Alterar Status do Animal (CORREÇÃO: Alinhado com ENUM do Banco)
  atualizarStatus(id, status) {
    const sql = `UPDATE animais_adocao SET status = ? WHERE id = ?`;

    // No banco, os valores aceitos são: 'Disponivel', 'Em_Analise', 'Adotado'
    return new Promise((resolve, reject) => {
      db.query(sql, [status, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  // A13 - Visualizar Animais Adotados
  listarAdotadosPorAdotante(adotanteId) {
    const sql = `
      SELECT a.*
      FROM animais_adocao a
      JOIN formularios_adocao f ON a.id = f.animal_id
      WHERE a.status = 'Adotado'
        AND f.adotante_id = ?
        AND f.status = 'Aprovado'
    `;

    return new Promise((resolve, reject) => {
      db.query(sql, [adotanteId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  // A6 - Favoritar Animal
  favoritar(adotanteId, animalId) {
    const sql = `INSERT INTO favoritos (adotante_id, animal_id) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
      db.query(sql, [adotanteId, animalId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  desfavoritar(adotanteId, animalId) {
    const sql = `DELETE FROM favoritos WHERE adotante_id = ? AND animal_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [adotanteId, animalId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  listarFavoritos(adotanteId) {
    const sql = `
      SELECT a.* FROM animais_adocao a
      JOIN favoritos f ON a.id = f.animal_id
      WHERE f.adotante_id = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sql, [adotanteId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  // P4 - Editar Animal
  atualizar(id, dados) {
    const campos = Object.keys(dados).map(key => `${key} = ?`).join(", ");
    const valores = [...Object.values(dados), id];
    const sql = `UPDATE animais_adocao SET ${campos} WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.query(sql, valores, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // P4 e AD6 - Remover Animal
  excluir(id) {
    const sql = `DELETE FROM animais_adocao WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
};