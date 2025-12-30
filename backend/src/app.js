import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import animalRoutes from "./routes/animalRoutes.js";
import formularioRoutes from "./routes/formularioRoutes.js"; 
import documentoRoutes from "./routes/documentoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Middleware para processar JSON (Essencial para RF01, RF04, RF10)
app.use(express.json());

// Definição das Rotas Base
app.use("/usuarios", usuarioRoutes);     // RF01, RF02
app.use("/animais", animalRoutes);       // RF04, RF05, RF06, RF07
app.use("/formularios", formularioRoutes); // RF10, RF12, RF18
app.use("/documentos", documentoRoutes);   // RF15, RF16
app.use("/admin", adminRoutes);           // RF03, RF19, RF20

export default app;