import multer from "multer";
import path from "path";
import fs from "fs";

// ==========================================
// 1. CONFIGURAÇÃO PARA FOTOS DE ANIMAIS
// ==========================================
const dirAnimais = "./uploads/animais/";
if (!fs.existsSync(dirAnimais)) {
    fs.mkdirSync(dirAnimais, { recursive: true });
}

const storageAnimais = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dirAnimais);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "PET-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const filterAnimais = (req, file, cb) => {
  const extensoesPermitidas = /jpeg|jpg|png/;
  const mimetype = extensoesPermitidas.test(file.mimetype);
  const extname = extensoesPermitidas.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Apenas imagens (jpeg, jpg, png) são permitidas para o animal!"));
};

export const uploadAnimal = multer({ 
  storage: storageAnimais,
  fileFilter: filterAnimais,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// ==========================================
// 2. CONFIGURAÇÃO PARA DOCUMENTOS (RF03)
// ==========================================
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
    // Prefixo DOC para identificar documentos de ONGs/Protetores
    cb(null, "DOC-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const filterDocs = (req, file, cb) => {
  // Para documentos, permitimos PDF além de imagens
  const extensoesPermitidas = /jpeg|jpg|png|pdf/;
  const mimetype = extensoesPermitidas.test(file.mimetype) || file.mimetype === 'application/pdf';
  const extname = extensoesPermitidas.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Formato inválido! Envie o comprovativo em PDF, JPEG ou PNG."));
};

export const uploadDocumento = multer({ 
  storage: storageDocs,
  fileFilter: filterDocs,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite maior para documentos (5MB)
});