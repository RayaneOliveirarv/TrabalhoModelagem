# 🐾 Sistema de Adoção e Gestão de Animais - Backend

Este projeto é um sistema completo para gestão de adoções, ligando Adotantes, ONGs e Protetores Individuais. O sistema inclui fluxos de verificação de segurança, moderação de conteúdo e geração automática de documentos jurídicos.

## 🚀 Tecnologias Utilizadas
* **Node.js** & **Express** (Servidor)
* **MySQL** (Base de Dados)
* **Multer** (Upload de fotos e documentos)
* **PDFKit** (Geração de Termos de Responsabilidade)



### 🏗️ Arquitetura do Projeto: Quem faz o quê?
Imagina que o nosso sistema é um Restaurante:

#### 1. 🛣️ Routes (O Menu)
O que faz: É onde definimos as URLs (os caminhos).

Função: Quando alguém faz um pedido (ex: POST /usuarios/cadastrar), a rota é o "menu" que diz: "Se o cliente pediu isso, chama o empregado (Controller) X".

Não decide nada: Ela apenas encaminha o pedido.

#### 2. 🎮 Controllers (O Empregado/Garçom)
O que faz: Recebe o pedido do cliente (o req) e entrega a resposta (o res).

Função: Ele retira os dados do pedido (nome, email, ID) e passa para a cozinha (Service). Quando a comida fica pronta, ele entrega ao cliente.

Responsabilidade: Validar se o que o cliente enviou existe e dar as mensagens de erro ou sucesso (Status 200, 400, 500).

#### 3. 🧠 Services (O Chef de Cozinha / O Cérebro)
O que faz: Aqui moram as Regras de Negócio (os teus RFs).

Função: É a parte mais inteligente. É o Service que pergunta: "A ONG está ativa? Se não estiver, bloqueia o cadastro!" ou "Este animal é para adoção? Se for perdido, não gera PDF!".

Responsabilidade: Fazer cálculos, verificações de segurança e lógica complexa.

#### 4. 🗄️ Models (A Despensa / SQL)
O que faz: É quem fala diretamente com a Base de Dados (MySQL).

Função: É onde escrevemos os comandos SQL (SELECT, INSERT, UPDATE). Ele apenas busca ou guarda os ingredientes (dados) na despensa.

Responsabilidade: Executar as queries e devolver os dados puros para o Service.

---

## 🛠️ Como Rodar o Projeto

### 1. Configuração da Base de Dados
Certifica-te de que o teu servidor MySQL está a correr. Tens três formas de configurar o banco:

#### **Opção A: Via MySQL Workbench (Visual)**
1. Abre o MySQL Workbench e liga-te ao teu servidor.
2. Abre o ficheiro `schema.sql` (na raiz do projeto).
3. Executa todo o script (ícone do raio) para criar a base de dados `sistema_adocao`.

#### **Opção B: Via Terminal (Caso não tenhas o Workbench)**
1. Abre o terminal (cmd ou powershell) na pasta do projeto.
2. Executa o comando abaixo (substitui `root` pelo teu utilizador do MySQL):
   ```bash
   mysql -u root -p < schema.sql


### 2. Instalação e Execução
No terminal, dentro da pasta do projeto, execute os comandos abaixo na ordem:

Bash

# Instalar as dependências do Node.js
npm install

# Iniciar o servidor em modo de desenvolvimento
npm run dev
O servidor estará ativo em: http://localhost:3000

### 📑 Simulação Completa do Sistema (End-to-End)
Siga esta ordem exata para validar os 20 Requisitos Funcionais (RFs).

#### 1️⃣ Fase de Cadastro: Criando os Personagens (RF01)
Crie os três perfis que usarão a plataforma.

Adotante (ID 1):

POST http://localhost:3000/usuarios/cadastrar

JSON: {"nome": "Alice Adotante", "email": "alice@email.com", "senha": "123", "tipo": "ADOTANTE"}

ONG (ID 2):

POST http://localhost:3000/usuarios/cadastrar

JSON: {"nome": "ONG Patas Solidárias", "email": "ong@email.com", "senha": "123", "tipo": "ONG"}

Protetor Individual (ID 3):

POST http://localhost:3000/usuarios/cadastrar

JSON: {"nome": "Carlos Protetor", "email": "carlos@email.com", "senha": "123", "tipo": "PROTETOR"}

#### 2️⃣ Fase de Segurança: A Chave do Admin (RF03 / RF19)
Neste momento, a ONG e o Protetor estão com status 'Pendente' e não podem postar nada. O Admin precisa liberá-los.

ONG e Protetor enviam documentos:

PUT http://localhost:3000/usuarios/enviar-documentacao/2 (ONG)

PUT http://localhost:3000/usuarios/enviar-documentacao/3 (Protetor)

(No Postman: Use form-data, chave documento, tipo File).

Admin Ativa a ONG (ID 2):

PUT http://localhost:3000/admin/usuario/moderar/2

JSON: {"acao": "Ativo", "motivo": "CNPJ e Estatuto validados."}

Admin Ativa o Protetor (ID 3):

PUT http://localhost:3000/admin/usuario/moderar/3

JSON: {"acao": "Ativo", "motivo": "Identidade e Residência validados."}

#### 3️⃣ Fase de Publicação: Alimentando o Feed (RF04 / RF05)
Agora que estão ativos, eles podem cadastrar animais.

ONG cadastra um Cão:

POST http://localhost:3000/animais/cadastrar

form-data: nome: Max, especie: Cao, porte: Medio, ong_id: 2, categoria: Adocao, foto: (arquivo)

Protetor cadastra um Gato:

POST http://localhost:3000/animais/cadastrar

form-data: nome: Luna, especie: Gato, porte: Pequeno, ong_id: 3, categoria: Adocao, foto: (arquivo)

#### 4️⃣ Fase de Interação: O Adotante em Ação (RF06 / RF08 / RF10)
Alice busca animais no feed (RF06):

GET http://localhost:3000/animais?especie=Cao

Alice favorita o gato da Luna (RF08):

POST http://localhost:3000/animais/favoritos

JSON: {"adotante_id": 1, "animal_id": 2}

Alice envia proposta para adotar o Max (ONG) (RF10):

POST http://localhost:3000/formularios/enviar

JSON: {"adotante_id": 1, "animal_id": 1, "experiencia": "Sim", "ambiente": "Casa quintal"}

#### 5️⃣ Fase de Decisão e Documentos (RF18 / RF15 / RF16)
A ONG (ID 2) aprova a Alice (RF18):

PUT http://localhost:3000/formularios/decidir/1

JSON: {"decisao": "Aprovado"}

O Sistema gera o Termo em PDF (RF15):

POST http://localhost:3000/documentos/gerar/1

O Adotante baixa o Termo (RF16):

GET http://localhost:3000/documentos/download/1

(No Postman: Use "Send and Download").

#### 6️⃣ Fase de Controle e Notificações (RF09 / RF20)
Alice verifica se recebeu o aviso de aprovação (RF09):

GET http://localhost:3000/usuarios/1/notificacoes

Admin modera o feed (Removendo post antigo ou irregular) (RF20):

DELETE http://localhost:3000/admin/animal/2 (Remove o gato da Luna do feed).

#### 💡 Resumo do que foi provado neste teste:
Segurança: Ninguém postou nada sem o Admin liberar (ONG/Protetor).

Versatilidade: O sistema aceitou tanto uma organização (ONG) quanto um cidadão comum (Protetor).

Ciclo de Vida: O animal foi criado, adotado e saiu do feed.

Jurídico: O PDF foi gerado com os dados reais da transação.


