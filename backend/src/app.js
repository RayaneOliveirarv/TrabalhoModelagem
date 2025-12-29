import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import animalRoutes from "./routes/animalRoutes.js";
import formularioRoutes from "./routes/formularioRoutes.js"; 
import documentoRoutes from "./routes/documentoRoutes.js";

const app = express();

app.use(express.json());

app.use("/usuarios", usuarioRoutes);
app.use("/animais", animalRoutes);
app.use("/formularios", formularioRoutes); 
app.use("/documentos", documentoRoutes);

export default app;
