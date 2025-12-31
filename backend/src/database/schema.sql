-- ==========================================================
-- SCHEMA FINAL ATUALIZADO - VERSÃO COMPLETA
-- INCLUI RF03 (UPLOAD DE DOCUMENTAÇÃO DE ONGS/PROTETORES)
-- ALINHADO COM FORMULARIO_MODEL E REQUISITOS DE MODERAÇÃO
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
  motivo_status TEXT -- RF19: Justificativa de bloqueio/ativação
);

CREATE TABLE administradores (
  usuario_id INT PRIMARY KEY,
  permissao VARCHAR(50),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 2. PERFIS DETALHADOS (ATUALIZADOS COM RF03)
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
  documento_url VARCHAR(255), -- RF03: Comprovativo para validação do Admin
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
  documento_url VARCHAR(255), -- RF03: Comprovativo (Contrato Social/CNPJ)
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. ANIMAIS (RF04, RF05, RF06)
CREATE TABLE animais_adocao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  idade VARCHAR(50), 
  especie VARCHAR(50),
  porte ENUM('Pequeno', 'Médio', 'Grande', 'Não informado') DEFAULT 'Não informado',
  descricao TEXT,
  localizacao VARCHAR(100),
  foto_url VARCHAR(255), -- RF05: Galeria de Fotos
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
  experiencia TEXT NOT NULL,
  ambiente TEXT NOT NULL,
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

-- 6. SEGURANÇA E MODERAÇÃO (RF19, RF20)
CREATE TABLE IF NOT EXISTS denuncias_usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_denunciado_id INT NOT NULL,
  denunciante_id INT NOT NULL,
  motivo TEXT NOT NULL,
  data_denuncia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Pendente', 'Analisado') DEFAULT 'Pendente',
  FOREIGN KEY (usuario_denunciado_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (denunciante_id) REFERENCES usuarios(id) ON DELETE CASCADE
);