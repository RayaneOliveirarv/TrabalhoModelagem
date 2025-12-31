-- ==========================================================
-- SCHEMA FINAL - 100% ALINHADO COM REQUISITOS (RF01 - RF20)
-- ==========================================================
CREATE DATABASE IF NOT EXISTS sistema_adocao;
USE sistema_adocao;

-- 1. USUÁRIOS E ADMINISTRAÇÃO
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(100) NOT NULL,
  tipo ENUM('ADOTANTE', 'PROTETOR', 'ONG', 'ADMIN') NOT NULL,
  status_conta ENUM('Pendente', 'Ativo', 'Bloqueado') DEFAULT 'Pendente',
  motivo_status TEXT -- ADICIONADO: Para o RF19 (Justificativa de bloqueio)
);

CREATE TABLE administradores (
  usuario_id INT PRIMARY KEY,
  permissao VARCHAR(50),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 2. PERFIS DETALHADOS
CREATE TABLE adotantes (
  usuario_id INT PRIMARY KEY,
  nome VARCHAR(100),
  cpf VARCHAR(14),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE protetores_individuais (
  usuario_id INT PRIMARY KEY,
  nome VARCHAR(100),
  cpf VARCHAR(14),
  historia TEXT,
  contato VARCHAR(100),
  localizacao VARCHAR(100),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE ongs (
  usuario_id INT PRIMARY KEY,
  nome VARCHAR(100),
  razao_social VARCHAR(100),
  cnpj VARCHAR(18),
  historia TEXT,
  contato VARCHAR(100),
  localizacao VARCHAR(100),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. ANIMAIS (RF04, RF05, RF06)
CREATE TABLE animais_adocao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  idade VARCHAR(50), 
  especie VARCHAR(50),
  porte ENUM('Pequeno', 'Médio', 'Grande', 'Não informado') DEFAULT 'Não informado', -- ADICIONADO: Para RF06
  descricao TEXT,
  localizacao VARCHAR(100),
  data_desaparecimento DATE,
  ultima_localizacao VARCHAR(100),
  status ENUM('Disponivel', 'Em_Analise', 'Adotado', 'Perdido', 'Encontrado') DEFAULT 'Disponivel',
  categoria ENUM('Adocao', 'Perdido') DEFAULT 'Adocao',
  
  ong_id INT NULL,
  protetor_id INT NULL,
  FOREIGN KEY (ong_id) REFERENCES ongs(usuario_id) ON DELETE SET NULL,
  FOREIGN KEY (protetor_id) REFERENCES protetores_individuais(usuario_id) ON DELETE SET NULL
);

-- 4. PROCESSOS E FORMULÁRIOS (RF10, RF12, RF18)
CREATE TABLE formularios_adocao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  adotante_id INT NOT NULL,
  animal_id INT NOT NULL,
  experiencia TEXT,
  ambiente TEXT,
  justificativa TEXT,
  data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Enviado', 'Em_Analise', 'Aprovado', 'Rejeitado') DEFAULT 'Enviado',
  documento_caminho VARCHAR(255), 

  FOREIGN KEY (adotante_id) REFERENCES adotantes(usuario_id),
  FOREIGN KEY (animal_id) REFERENCES animais_adocao(id) ON DELETE CASCADE
);

-- 5. FAVORITOS (RF08)
CREATE TABLE favoritos (
  adotante_id INT,
  animal_id INT,
  PRIMARY KEY (adotante_id, animal_id),
  FOREIGN KEY (adotante_id) REFERENCES adotantes(usuario_id) ON DELETE CASCADE,
  FOREIGN KEY (animal_id) REFERENCES animais_adocao(id) ON DELETE CASCADE
);

-- 6. DENÚNCIAS (ADICIONADO: Para RF20 - Moderação de conteúdo)
CREATE TABLE denuncias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  denunciante_id INT NOT NULL,
  animal_id INT NOT NULL,
  motivo TEXT NOT NULL,
  data_denuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Pendente', 'Analisada') DEFAULT 'Pendente',
  FOREIGN KEY (denunciante_id) REFERENCES usuarios(id),
  FOREIGN KEY (animal_id) REFERENCES animais_adocao(id) ON DELETE CASCADE
);