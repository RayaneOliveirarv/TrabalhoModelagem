import app from "./app.js"; // Importa a instância do Express configurada com rotas e middlewares
import "./config/db.js";    // Executa o ficheiro de configuração da base de dados (ativa a conexão)

const PORT = 3000;

/**
 * Inicializa o servidor HTTP.
 * A partir deste momento, a API está "escutando" na porta definida.
 */
app.listen(PORT, () => {
  console.log(`-----------------------------------------`);
  console.log(`🐾 Sistema de Adoção Online!`);
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`-----------------------------------------`);
});