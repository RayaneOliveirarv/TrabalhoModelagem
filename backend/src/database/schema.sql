-- ==========================================================
-- SCHEMA FINAL ATUALIZADO - SISTEMA DE ADOÇÃO
-- ==========================================================

-- Criação do banco de dados, garantindo que não haja erro se ele já existir
CREATE DATABASE IF NOT EXISTS sistema_adocao;
USE sistema_adocao;

-- ----------------------------------------------------------
-- 1. NÚCLEO DE USUÁRIOS
-- ----------------------------------------------------------

-- Tabela base: Todas as contas (Adotante, ONG, etc) começam aqui.
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE, -- Unique impede emails duplicados
  senha VARCHAR(100) NOT NULL,
  tipo ENUM('ADOTANTE', 'PROTETOR', 'ONG', 'ADMIN') NOT NULL,
  -- O status define se o usuário pode ou não interagir com o sistema
  status_conta ENUM('Pendente', 'Ativo', 'Bloqueado') DEFAULT 'Pendente',
  motivo_status TEXT -- RF19: Armazena o porquê de um bloqueio ou aprovação
);

-- Tabela de Administradores: Apenas para contas de gestão do sistema
CREATE TABLE administradores (
  usuario_id INT PRIMARY KEY,
  permissao VARCHAR(50), -- Ex: 'SuperAdmin', 'Moderador'
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- 2. PERFIS ESPECÍFICOS (Especialização de Usuários)
-- ----------------------------------------------------------

-- Perfil para quem quer adotar
CREATE TABLE adotantes (
  usuario_id INT PRIMARY KEY,
  nome VARCHAR(100),
  cpf VARCHAR(14),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Perfil para protetores independentes (Pessoas físicas)
CREATE TABLE protetores_individuais (
  usuario_id INT PRIMARY KEY,
  nome VARCHAR(100),
  cpf VARCHAR(14),
  historia TEXT,
  contato VARCHAR(100),
  localizacao VARCHAR(100),
  documento_url VARCHAR(255), -- RF03: Caminho do arquivo enviado via Multer para verificação
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Perfil para Instituições (Pessoas jurídicas)
CREATE TABLE ongs (
  usuario_id INT PRIMARY KEY,
  nome VARCHAR(100),
  razao_social VARCHAR(100),
  cnpj VARCHAR(18),
  historia TEXT,
  contato VARCHAR(100),
  localizacao VARCHAR(100),
  documento_url VARCHAR(255), -- RF03: Comprovativo de existência da ONG
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- 3. GESTÃO DE ANIMAIS
-- ----------------------------------------------------------

CREATE TABLE animais_adocao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  idade VARCHAR(50), 
  especie VARCHAR(50),
  porte ENUM('Pequeno', 'Médio', 'Grande', 'Não informado') DEFAULT 'Não informado',
  descricao TEXT,
  localizacao VARCHAR(100),
  foto_url VARCHAR(255), -- RF05: Link para a imagem processada pelo Controller de Upload
  data_desaparecimento DATE, -- Usado se a categoria for 'Perdido'
  ultima_localizacao VARCHAR(100),
  status ENUM('Disponivel', 'Em_Analise', 'Adotado', 'Perdido', 'Encontrado') DEFAULT 'Disponivel',
  categoria ENUM('Adocao', 'Perdido', 'Encontrado') DEFAULT 'Adocao',
  
  -- Um animal pode pertencer ou a uma ONG ou a um Protetor
  ong_id INT NULL,
  protetor_id INT NULL,
  FOREIGN KEY (ong_id) REFERENCES ongs(usuario_id) ON DELETE SET NULL,
  FOREIGN KEY (protetor_id) REFERENCES protetores_individuais(usuario_id) ON DELETE SET NULL
);

-- ----------------------------------------------------------
-- 4. PROCESSOS DE ADOÇÃO E DOCUMENTOS
-- ----------------------------------------------------------

CREATE TABLE formularios_adocao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  adotante_id INT NOT NULL,
  animal_id INT NOT NULL,
  experiencia TEXT NOT NULL, -- Relato de experiências prévias com pets
  ambiente TEXT NOT NULL,    -- Descrição da casa (apartamento, quintal, etc)
  justificativa TEXT,        -- Por que quer adotar este animal específico
  data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Enviado', 'Em_Analise', 'Aprovado', 'Rejeitado') DEFAULT 'Enviado',
  documento_caminho VARCHAR(255), -- RF15/16: Caminho do PDF gerado pelo DocumentoController

  FOREIGN KEY (adotante_id) REFERENCES adotantes(usuario_id),
  FOREIGN KEY (animal_id) REFERENCES animais_adocao(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- 5. INTERAÇÃO (FAVORITOS E DENÚNCIAS)
-- ----------------------------------------------------------

-- Tabela associativa: Relaciona muitos adotantes a muitos animais (N:M)
CREATE TABLE favoritos (
  adotante_id INT,
  animal_id INT,
  PRIMARY KEY (adotante_id, animal_id),
  FOREIGN KEY (adotante_id) REFERENCES adotantes(usuario_id) ON DELETE CASCADE,
  FOREIGN KEY (animal_id) REFERENCES animais_adocao(id) ON DELETE CASCADE
);

-- RF20: Registro de denúncias para moderação administrativa
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

-- ----------------------------------------------------------
-- 6. COMUNICAÇÃO (NOTIFICAÇÕES INTERNAS)
-- ----------------------------------------------------------

-- Tabela para alertas de sistema (Aprovação de cadastro, novas mensagens, etc)
CREATE TABLE IF NOT EXISTS notificacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  tipo ENUM('SUCESSO', 'ALERTA', 'ERRO', 'INFORMATIVO') DEFAULT 'INFORMATIVO',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);