import db from "../config/db.js";

export const cadastrarUsuario = (req, res) => {
  const { email, senha, tipo } = req.body;

  const sql = `INSERT INTO usuarios (email, senha, tipo) VALUES (?, ?, ?)`;

  db.query(sql, [email, senha, tipo], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      usuarioId: result.insertId
    });
  });
};

export const loginUsuario = (req, res) => {
  const { email, senha } = req.body;

  const sql = `SELECT * FROM usuarios WHERE email = ?`;

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(401).json({ mensagem: "Usuário não encontrado" });
    }

    const usuario = results[0];

    if (usuario.senha !== senha) {
      return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    res.json({
      mensagem: "Login realizado com sucesso",
      usuario: {
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  });
};
