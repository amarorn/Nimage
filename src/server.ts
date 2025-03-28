import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { MongoDB } from "./infrastructure/database/MongoDB";
import { InitialCacheService } from "./application/services/InitialCacheService";
import app from "./app";

// Importação das rotas
import vendedorRoutes from "./interfaces/routes/vendedorRoutes";
import equipeRoutes from "./interfaces/routes/equipeRoutes";
import atividadeRoutes from "./interfaces/routes/atividadeRoutes";
import metaRoutes from "./interfaces/routes/metaRoutes";
import temaRoutes from "./interfaces/routes/temaRoutes";
import cargoRoutes from "./interfaces/routes/cargoRoutes";
// Configuração do dotenv
config();

const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api", vendedorRoutes);
app.use("/api", equipeRoutes);
app.use("/api", atividadeRoutes);
app.use("/api", metaRoutes);
app.use("/api", temaRoutes);
app.use("/api", cargoRoutes);

// Inicialização do servidor
const startServer = async () => {
    try {
        // Conecta ao banco de dados
        await MongoDB.conectar();

        // Inicializa o cache da aplicação
        const initialCacheService = new InitialCacheService();
        await initialCacheService.initializeCache();

        // Inicia o servidor
        app.listen(port, () => {
            console.log(`🚀 Servidor rodando na porta ${port}`);
        });
    } catch (error) {
        console.error("❌ Erro ao iniciar o servidor:", error);
        process.exit(1);
    }
};

startServer();