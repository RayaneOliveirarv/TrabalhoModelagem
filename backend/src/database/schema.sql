-- =========================
-- BANCO DE DADOS
-- =========================
CREATE DATABASE IF NOT EXISTS sistema_adocao;
USE sistema_adocao;

-- =========================
-- USUÁRIOS
-- =========================
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(100) NOT NULL,
  tipo ENUM('ADOTANTE', 'PROTETOR', 'ONG', 'ADMIN') NOT NULL
);

CREATE TABLE administradores (
  usuario_id INT PRIMARY KEY,
  permissao VARCHAR(50),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE adotantes (
  usuario_id INT PRIMARY KEY,
  nome VARCHAR(100),
  cpf VARCHAR(14),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE protetores_individuais (
  usuario_id INT PRIMARY KEY,
  nome VARCHAR(100),
  cpf VARCHAR(14),
  historia TEXT,
  contato VARCHAR(100),
  localizacao VARCHAR(100),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE ongs (
  usuario_id INT PRIMARY KEY,
  nome VARCHAR(100),
  razao_social VARCHAR(100),
  cnpj VARCHAR(18),
  historia TEXT,
  contato VARCHAR(100),
  localizacao VARCHAR(100),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =========================
-- ANIMAIS PARA ADOÇÃO
-- =========================
CREATE TABLE animais_adocao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  idade INT,
  especie VARCHAR(50),
  descricao TEXT,
  localizacao VARCHAR(100),
  status ENUM('Disponivel', 'Em_Analise', 'Adotado') DEFAULT 'Disponivel',

  ong_id INT,
  protetor_id INT,

  FOREIGN KEY (ong_id) REFERENCES ongs(usuario_id),
  FOREIGN KEY (protetor_id) REFERENCES protetores_individuais(usuario_id)
);

-- =========================
-- ANIMAIS PERDIDOS
-- =========================
CREATE TABLE animais_perdidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  idade INT,
  especie VARCHAR(50),
  descricao TEXT,
  localizacao VARCHAR(100),
  data_desaparecimento DATE,
  ultima_localizacao VARCHAR(100),
  status ENUM('Perdido', 'Encontrado') DEFAULT 'Perdido',

  ong_id INT,
  protetor_id INT,

  FOREIGN KEY (ong_id) REFERENCES ongs(usuario_id),
  FOREIGN KEY (protetor_id) REFERENCES protetores_individuais(usuario_id)
);

-- =========================
-- FORMULÁRIOS DE ADOÇÃO
-- =========================
CREATE TABLE formularios_adocao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  adotante_id INT NOT NULL,
  animal_id INT NOT NULL,
  dados_adotante TEXT,
  justificativa TEXT,
  data_envio DATE,
  status ENUM('Enviado', 'Em_Analise', 'Aprovado', 'Rejeitado') DEFAULT 'Enviado',

  FOREIGN KEY (adotante_id) REFERENCES adotantes(usuario_id),
  FOREIGN KEY (animal_id) REFERENCES animais_adocao(id)
);

-- =========================
-- DOCUMENTOS DE ADOÇÃO
-- =========================
CREATE TABLE documentos_adocao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT UNIQUE,
  adotante_id INT,
  arquivo_pdf VARCHAR(255),
  data DATE,

  FOREIGN KEY (animal_id) REFERENCES animais_adocao(id),
  FOREIGN KEY (adotante_id) REFERENCES adotantes(usuario_id)
);

-- =========================
-- FAVORITOS (ADOTANTE x ANIMAL)
-- =========================
CREATE TABLE favoritos (
  adotante_id INT,
  animal_id INT,

  PRIMARY KEY (adotante_id, animal_id),
  FOREIGN KEY (adotante_id) REFERENCES adotantes(usuario_id),
  FOREIGN KEY (animal_id) REFERENCES animais_adocao(id)
);
