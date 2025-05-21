"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const vendedorRoutes_1 = __importDefault(require("./interfaces/routes/vendedorRoutes"));
const atividadeRoutes_1 = __importDefault(require("./interfaces/routes/atividadeRoutes"));
const equipeRoutes_1 = __importDefault(require("./interfaces/routes/equipeRoutes"));
const metaRoutes_1 = __importDefault(require("./interfaces/routes/metaRoutes"));
const desempenhoIdealRoutes_1 = __importDefault(require("./interfaces/routes/desempenhoIdealRoutes"));
const temaRoutes_1 = __importDefault(require("./interfaces/routes/temaRoutes"));
const cargoRoutes_1 = __importDefault(require("./interfaces/routes/cargoRoutes"));
const clienteRoutes_1 = __importDefault(require("./interfaces/routes/clienteRoutes"));
const MetricsMiddleware_1 = require("./infrastructure/middleware/MetricsMiddleware");
const healthRoutes_1 = __importDefault(require("./interfaces/routes/healthRoutes"));
const metricsRoutes_1 = __importDefault(require("./interfaces/routes/metricsRoutes"));
console.log('📦 Iniciando configuração do app...');
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use(MetricsMiddleware_1.metricsMiddleware);
console.log('🔧 Configurando CORS...');
app.use((0, cors_1.default)({
    origin: '*'
}));
console.log('🛣️ Configurando rotas...');
// Rotas da API
console.log('🔄 Registrando rotas...');
app.use("/api", vendedorRoutes_1.default);
app.use("/api", atividadeRoutes_1.default);
app.use("/api", equipeRoutes_1.default);
app.use("/api", metaRoutes_1.default);
app.use("/api", desempenhoIdealRoutes_1.default);
app.use("/api", temaRoutes_1.default);
app.use("/api", cargoRoutes_1.default);
app.use("/api", clienteRoutes_1.default);
app.use("/api", healthRoutes_1.default);
// Rotas de monitoramento
app.use("/", metricsRoutes_1.default);
// Rota de métricas
app.get('/metrics', MetricsMiddleware_1.metricsEndpoint);
console.log('✅ App configurado com sucesso!');
exports.default = app;
//# sourceMappingURL=app.js.map