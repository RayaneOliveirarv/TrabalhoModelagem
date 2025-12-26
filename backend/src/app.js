import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import animalRoutes from "./routes/animalRoutes.js";

const app = express();

app.use(express.json());

app.use("/usuarios", usuarioRoutes);
app.use("/animais", animalRoutes);

export default app;
