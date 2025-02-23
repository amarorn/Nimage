import express from "express";
import cors from "cors"; // Importe o pacote cors
import { MongoDB } from "./infrastructure/database/MongoDB";

const app = express();
const PORT = process.env.PORT || 3000;

// Use o middleware CORS
app.use(cors());

MongoDB.conectar().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
});