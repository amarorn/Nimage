import express from "express";
import cors from "cors";
import vendedorRoutes from "./interfaces/routes/vendedorRoutes";
import atividadeRoutes from "./interfaces/routes/atividadeRoutes";
import equipeRoutes from "./interfaces/routes/equipeRoutes";
import metaRoutes from "./interfaces/routes/metaRoutes";
import desempenhoIdealRoutes from "./interfaces/routes/desempenhoIdealRoutes";
import temaRoutes from './interfaces/routes/temaRoutes';
import cargoRoutes from './interfaces/routes/cargoRoutes';
import { Request, Response } from 'express';
import { metricsMiddleware, metricsEndpoint } from './infrastructure/middleware/metricsMiddleware';
import healthRoutes from './interfaces/routes/healthRoutes';
import metricsRoutes from './interfaces/routes/metricsRoutes';

console.log('📦 Iniciando configuração do app...');

const app = express();

// Middlewares
app.use(express.json());
app.use(metricsMiddleware);

console.log('🔧 Configurando CORS...');
app.use(cors({
    origin: '*'
}));

console.log('🛣️ Configurando rotas...');

// Rotas da API
console.log('🔄 Registrando rotas...');
app.use("/api", vendedorRoutes);
app.use("/api", atividadeRoutes);
app.use("/api", equipeRoutes);
app.use("/api", metaRoutes);
app.use("/api", desempenhoIdealRoutes);
app.use("/api", temaRoutes);
app.use("/api", cargoRoutes);
app.use("/api", healthRoutes);

// Rotas de monitoramento
app.use("/", metricsRoutes);

console.log('✅ App configurado com sucesso!');

export default app;