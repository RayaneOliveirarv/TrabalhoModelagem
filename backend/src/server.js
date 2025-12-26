import app from "./app.js";
import "./config/db.js";   // ativa a conexão com o banco

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
