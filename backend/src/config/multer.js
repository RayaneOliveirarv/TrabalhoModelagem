import multer from "multer";
import path from "path";
import fs from "fs";

// ==========================================
// 1. CONFIGURAÇÃO PARA FOTOS DE ANIMAIS
// ==========================================

// Define o caminho da pasta onde as fotos dos animais serão salvas
const dirAnimais = "./uploads/animais/";

// Verifica se a pasta existe; se não existir, o 'fs' a cria automaticamente
// O 'recursive: true' garante que pastas pai também sejam criadas se necessário
if (!fs.existsSync(dirAnimais)) {
    fs.mkdirSync(dirAnimais, { recursive: true });
}

// Configura como o arquivo será armazenado no disco
const storageAnimais = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define o destino final do arquivo
    cb(null, dirAnimais);
  },
  filename: (req, file, cb) => {
    // Gera um nome único usando a data atual + número aleatório enorme
    // Isso evita que um arquivo sobrescreva outro com o mesmo nome original
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    // Exemplo de resultado: PET-1715000000-123456789.jpg
    cb(null, "PET-" + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de segurança para aceitar apenas formatos de imagem específicos
const filterAnimais = (req, file, cb) => {
  const extensoesPermitidas = /jpeg|jpg|png/;
  // Valida o tipo MIME (ex: image/png) e a extensão do nome do arquivo
  const mimetype = extensoesPermitidas.test(file.mimetype);
  const extname = extensoesPermitidas.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true); // Aceita o arquivo
  }
  // Rejeita o arquivo com uma mensagem de erro
  cb(new Error("Apenas imagens (jpeg, jpg, png) são permitidas para o animal!"));
};

// Exporta a configuração pronta para ser usada nas rotas de animais
export const uploadAnimal = multer({ 
  storage: storageAnimais,
  fileFilter: filterAnimais,
  limits: { fileSize: 2 * 1024 * 1024 } // Limita o tamanho em 2MB
});

// ==========================================
// 2. CONFIGURAÇÃO PARA DOCUMENTOS (RF03)
// ==========================================

// Define a pasta para documentos de verificação (ONGs/Protetores)
const dirDocs = "./uploads/documentos_verificacao/";
if (!fs.existsSync(dirDocs)) {
    fs.mkdirSync(dirDocs, { recursive: true });
}

const storageDocs = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dirDocs);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    // Prefixo DOC para diferenciar visualmente arquivos de documentos nas pastas
    cb(null, "DOC-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const filterDocs = (req, file, cb) => {
  // Para documentos, a regra é mais flexível: aceitamos PDF também
  const extensoesPermitidas = /jpeg|jpg|png|pdf/;
  const mimetype = extensoesPermitidas.test(file.mimetype) || file.mimetype === 'application/pdf';
  const extname = extensoesPermitidas.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Formato inválido! Envie o comprovativo em PDF, JPEG ou PNG."));
};

// Exporta a configuração pronta para as rotas de documentos/verificação
export const uploadDocumento = multer({ 
  storage: storageDocs,
  fileFilter: filterDocs,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite maior (5MB) pois PDFs costumam ser pesados
});