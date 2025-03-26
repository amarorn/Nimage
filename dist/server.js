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
// Importação das rotas
const vendedorRoutes_1 = __importDefault(require("./interfaces/routes/vendedorRoutes"));
const equipeRoutes_1 = __importDefault(require("./interfaces/routes/equipeRoutes"));
const atividadeRoutes_1 = __importDefault(require("./interfaces/routes/atividadeRoutes"));
const metaRoutes_1 = __importDefault(require("./interfaces/routes/metaRoutes"));
const temaRoutes_1 = __importDefault(require("./interfaces/routes/temaRoutes"));
// Configuração do dotenv
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rotas
app.use("/api", vendedorRoutes_1.default);
app.use("/api", equipeRoutes_1.default);
app.use("/api", atividadeRoutes_1.default);
app.use("/api", metaRoutes_1.default);
app.use("/api", temaRoutes_1.default);
// Inicialização do servidor
const startServer = async () => {
    try {
        // Conecta ao banco de dados
        await MongoDB_1.MongoDB.conectar();
        // Inicializa o cache da aplicação
        const initialCacheService = new InitialCacheService_1.InitialCacheService();
        await initialCacheService.initializeCache();
        // Inicia o servidor
        app.listen(port, () => {
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