import express from "express";
import path from "path"; // Import necessário para servir a pasta de uploads
import usuarioRoutes from "./routes/usuarioRoutes.js";
import animalRoutes from "./routes/animalRoutes.js";
import formularioRoutes from "./routes/formularioRoutes.js"; 
import documentoRoutes from "./routes/documentoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// 1. Middleware para processar JSON (Essencial para RF01, RF04, RF10)
app.use(express.json());

// 2. Middleware para processar formulários complexos (útil para o Multer)
app.use(express.urlencoded({ extended: true }));

/**
 * 3. SERVIR ARQUIVOS ESTÁTICOS (RF05)
 * Isso permite que ao aceder a http://localhost:3000/uploads/animais/imagem.jpg
 * o Express entregue o ficheiro real que está na pasta.
 */
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// 4. Definição das Rotas Base
app.use("/usuarios", usuarioRoutes);       // RF01, RF02
app.use("/animais", animalRoutes);         // RF04, RF05, RF06, RF07
app.use("/formularios", formularioRoutes); // RF10, RF12, RF18
app.use("/documentos", documentoRoutes);     // RF15, RF16
app.use("/admin", adminRoutes);             // RF03, RF19, RF20

// Middleware de tratamento de erros global (Opcional, mas recomendado para Multer)
app.use((err, req, res, next) => {
  if (err instanceof Error) {
    return res.status(400).json({ erro: err.message });
  }
  res.status(500).json({ erro: "Erro interno no servidor." });
});

export default app;