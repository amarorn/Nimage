import express from "express";
import cors from "cors";
import vendedorRoutes from "./interfaces/routes/vendedorRoutes";
import atividadeRoutes from "./interfaces/routes/atividadeRoutes";
import equipeRoutes from "./interfaces/routes/equipeRoutes";
import metaRoutes from "./interfaces/routes/metaRoutes";
import desempenhoIdealRoutes from "./interfaces/routes/desempenhoIdealRoutes";
import temaRoutes from './interfaces/routes/temaRoutes';
import cargoRoutes from './interfaces/routes/cargoRoutes';
import clienteRoutes from './interfaces/routes/clienteRoutes';
import { Request, Response } from 'express';
import { metricsMiddleware, metricsEndpoint } from './infrastructure/middleware/MetricsMiddleware';
import healthRoutes from './interfaces/routes/healthRoutes';
import metricsRoutes from './interfaces/routes/metricsRoutes';
import montadoraRoutes from './interfaces/routes/montadoraRoutes';
import lojaRoutes from './interfaces/routes/lojaRoutes';

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
app.use("/api", clienteRoutes);
app.use("/api", healthRoutes);
app.use("/api", montadoraRoutes);
app.use("/api", lojaRoutes);

// Rotas de monitoramento
app.use("/", metricsRoutes);

// Rota de métricas
app.get('/metrics', metricsEndpoint);

console.log('✅ App configurado com sucesso!');

export default app;