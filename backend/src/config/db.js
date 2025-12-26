import mysql from "mysql2";

const db = mysql.createConnection({
  host: "127.0.0.1",     // TCP explícito
  user: "adocao",        // usuário 
  password: "123456",    // senha
  database: "sistema_adocao",
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err);
    return;
  }
  console.log("Banco conectado com sucesso");
});

export default db;
