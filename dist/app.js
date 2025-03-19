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
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Use o middleware CORS
app.use((0, cors_1.default)({
    origin: '*'
    //methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //allowedHeaders: ['Content-Type', 'Authorization']
}));
// Adicionando o endpoint de health check com o prefixo /api
app.get("/api/health", (req, res) => {
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
app.use("/api", vendedorRoutes_1.default);
app.use("/api", atividadeRoutes_1.default);
app.use("/api", equipeRoutes_1.default);
app.use("/api", metaRoutes_1.default);
app.use("/api", desempenhoIdealRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map