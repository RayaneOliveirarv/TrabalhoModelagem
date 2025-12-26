import db from "../config/db.js";

export const cadastrarAnimal = (req, res) => {
  const {
    nome,
    idade,
    especie,
    descricao,
    localizacao,
    ong_id,
    protetor_id
  } = req.body;

  // regra simples: só um dos dois pode existir
  if (!ong_id && !protetor_id) {
    return res.status(400).json({
      mensagem: "Informe ong_id ou protetor_id"
    });
  }

  const sql = `
    INSERT INTO animais_adocao
    (nome, idade, especie, descricao, localizacao, ong_id, protetor_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nome,
      idade,
      especie,
      descricao,
      localizacao,
      ong_id || null,
      protetor_id || null
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      res.status(201).json({
        mensagem: "Animal cadastrado para adoção",
        animalId: result.insertId
      });
    }
  );
};

export const listarAnimais = (req, res) => {
  const sql = `
    SELECT 
      id,
      nome,
      idade,
      especie,
      descricao,
      localizacao,
      status
    FROM animais_adocao
    WHERE status = 'Disponivel'
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};

export const buscarAnimalPorId = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      id,
      nome,
      idade,
      especie,
      descricao,
      localizacao,
      status
    FROM animais_adocao
    WHERE id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ mensagem: "Animal não encontrado" });
    }

    res.json(results[0]);
  });
};
