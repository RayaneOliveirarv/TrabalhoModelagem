// Importa o driver 'mysql2' que permite a comunicação do Node.js com o banco MySQL.
import mysql from "mysql2";

// Cria um objeto de configuração para a conexão. 
// Pense nisso como o "cartão de acesso" que o seu código usa para entrar no banco.
const db = mysql.createConnection({
  host: "127.0.0.1",     // O endereço onde o banco está rodando (IP local ou domínio).
  user: "adocao",        // O nome de usuário que tem permissão de acesso.
  password: "123456",    // A senha secreta desse usuário.
  database: "sistema_adocao", // O nome específico do banco de dados que você quer manipular.
  port: 3306             // A porta de rede padrão que o MySQL utiliza.
});

// O método .connect() inicia a tentativa de comunicação física com o servidor de banco de dados.
db.connect((err) => {
  // Verificamos se existe algum erro (err) no objeto retornado pelo driver.
  if (err) {
    // Caso ocorra um erro (ex: senha errada, banco offline), ele será exibido aqui.
    console.error("Erro ao conectar no banco de dados:", err.stack);
    return;
  }
  
  // Se não houver erro, esta mensagem confirmará que a ponte entre o Node e o MySQL está aberta.
  console.log("Banco conectado com sucesso! ID da conexão: " + db.threadId);
});

// Exporta a instância 'db' para que você possa importá-la em outros arquivos do projeto.
// Isso permite executar queries (SELECT, INSERT, etc) em diferentes partes da sua aplicação.
export default db;