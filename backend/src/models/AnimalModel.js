import db from "../config/db.js";

export const AnimalModel = {
  // P3 - Cadastrar Animal (Adoção ou Perdido)
  criar(dados) {
    const sql = `
      INSERT INTO animais_adocao
      (nome, idade, especie, porte, descricao, localizacao, ong_id, protetor_id, status, categoria, data_desaparecimento, ultima_localizacao)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          dados.nome,
          dados.idade,
          dados.especie,
          dados.porte || 'Não informado',
          dados.descricao,
          dados.localizacao,
          dados.ong_id || null,
          dados.protetor_id || null,
          dados.status || 'Disponivel',
          dados.categoria || 'Adocao',
          dados.data_desaparecimento || null,
          dados.ultima_localizacao || null
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },

  // RF06 - Busca Avançada com Filtros Dinâmicos
  buscarAvancada(filtros) {
    let sql = `
      SELECT a.*, 
             COALESCE(o.nome, p.nome) as dono_nome
      FROM animais_adocao a
      LEFT JOIN ongs o ON a.ong_id = o.usuario_id
      LEFT JOIN protetores_individuais p ON a.protetor_id = p.usuario_id
      WHERE 1=1`;
    
    const valores = [];

    if (filtros.categoria) {
      sql += ` AND a.categoria = ?`;
      valores.push(filtros.categoria);
    }
    if (filtros.especie) {
      sql += ` AND a.especie = ?`;
      valores.push(filtros.especie);
    }
    if (filtros.porte) {
      sql += ` AND a.porte = ?`;
      valores.push(filtros.porte);
    }
    if (filtros.localizacao) {
      sql += ` AND a.localizacao LIKE ?`;
      valores.push(`%${filtros.localizacao}%`);
    }

    sql += ` ORDER BY a.id DESC`;

    return new Promise((resolve, reject) => {
      db.query(sql, valores, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

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

  atualizarStatus(id, status) {
    const sql = `UPDATE animais_adocao SET status = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [status, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  // Favoritos
  favoritar(adotanteId, animalId) {
    const sql = `INSERT INTO favoritos (adotante_id, animal_id) VALUES (?, ?)`;
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

  desfavoritar(adotanteId, animalId) {
    const sql = `DELETE FROM favoritos WHERE adotante_id = ? AND animal_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, [adotanteId, animalId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

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