"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const MongoDB_1 = require("./infrastructure/database/MongoDB");
const InitialCacheService_1 = require("./application/services/InitialCacheService");
const app_1 = __importDefault(require("./app"));
// Importação das rotas
const vendedorRoutes_1 = __importDefault(require("./interfaces/routes/vendedorRoutes"));
const equipeRoutes_1 = __importDefault(require("./interfaces/routes/equipeRoutes"));
const atividadeRoutes_1 = __importDefault(require("./interfaces/routes/atividadeRoutes"));
const metaRoutes_1 = __importDefault(require("./interfaces/routes/metaRoutes"));
const temaRoutes_1 = __importDefault(require("./interfaces/routes/temaRoutes"));
const cargoRoutes_1 = __importDefault(require("./interfaces/routes/cargoRoutes"));
const clienteRoutes_1 = __importDefault(require("./interfaces/routes/clienteRoutes"));
// Configuração do dotenv
(0, dotenv_1.config)();
const port = process.env.PORT || 3001;
// Middlewares
app_1.default.use((0, cors_1.default)());
app_1.default.use(express_1.default.json());
// Rotas
app_1.default.use("/api", vendedorRoutes_1.default);
app_1.default.use("/api", equipeRoutes_1.default);
app_1.default.use("/api", atividadeRoutes_1.default);
app_1.default.use("/api", metaRoutes_1.default);
app_1.default.use("/api", temaRoutes_1.default);
app_1.default.use("/api", cargoRoutes_1.default);
app_1.default.use("/api", clienteRoutes_1.default);
// Inicialização do servidor
const startServer = async () => {
    try {
        // Conecta ao banco de dados
        const mongoDB = MongoDB_1.MongoDB.getInstance();
        await mongoDB.connect();
        // Inicializa o cache da aplicação
        const initialCacheService = new InitialCacheService_1.InitialCacheService();
        await initialCacheService.initializeCache();
        // Inicia o servidor
        app_1.default.listen(port, () => {
            console.log(`🚀 Servidor rodando na porta ${port}`);
        });
    }
    catch (error) {
        console.error("❌ Erro ao iniciar o servidor:", error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map