import multer from "multer";
import path from "path";
import fs from "fs";

// Garante que a pasta de uploads existe
const dir = "./uploads/animais/";
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Gera um nome único: timestamp + nome original limpo
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const extensoesPermitidas = /jpeg|jpg|png/;
  const mimetype = extensoesPermitidas.test(file.mimetype);
  const extname = extensoesPermitidas.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Apenas imagens (jpeg, jpg, png) são permitidas!"));
};

export const uploadAnimal = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Limite de 2MB
});