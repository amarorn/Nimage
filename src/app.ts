import express from "express";
import cors from "cors";
import vendedorRoutes from "./interfaces/routes/vendedorRoutes";
import atividadeRoutes from "./interfaces/routes/atividadeRoutes";
import equipeRoutes from "./interfaces/routes/equipeRoutes";
import metaRoutes from "./interfaces/routes/metaRoutes";
import desempenhoIdealRoutes from "./interfaces/routes/desempenhoIdealRoutes";
import temaRoutes from './interfaces/routes/temaRoutes';

console.log('📦 Iniciando configuração do app...');

const app = express();
app.use(express.json());

console.log('🔧 Configurando CORS...');
// Use o middleware CORS
app.use(cors({
    origin: '*'
    //methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log('🛣️ Configurando rotas...');

// Adicionando o endpoint de health check com o prefixo /api
app.get("/api/health", (req, res) => {
    console.log('📡 Health check solicitado');
    res.status(200).json({
        status: "UP",
        timestamp: new Date().toISOString(),
        services: {
            api: "running",
            database: "connected",
            ollama: process.env.OLLAMA_URL || 'http://localhost:11434/api'
        },
        version: process.env.npm_package_version || '1.0.0'
    });
});

console.log('🔄 Registrando rotas...');
app.use("/api", vendedorRoutes);
app.use("/api", atividadeRoutes);
app.use("/api", equipeRoutes);
app.use("/api", metaRoutes);
app.use("/api", desempenhoIdealRoutes);
app.use('/api', temaRoutes);

console.log('✅ App configurado com sucesso!');

export default app;