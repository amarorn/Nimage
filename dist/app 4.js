"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const OllamaService_1 = require("./infrastructure/OllamaService");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Use o middleware CORS
app.use((0, cors_1.default)({
    origin: '*'
    //methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //allowedHeaders: ['Content-Type', 'Authorization']
}));
// Adicionando o endpoint de health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", message: "Service is running smoothly" });
});
app.use("/api", vendedorRoutes_1.default);
app.use("/api", atividadeRoutes_1.default);
app.use("/api", equipeRoutes_1.default);
app.use("/api", metaRoutes_1.default);
app.use("/api", desempenhoIdealRoutes_1.default);
const ollamaService = new OllamaService_1.OllamaService();
function executeOllamaCommand() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isHealthy = yield ollamaService.checkHealth();
            if (!isHealthy) {
                console.error('Ollama service is not available at startup');
                return;
            }
            console.log('Ollama service is healthy at startup');
            // You can call runCommand here if needed
        }
        catch (error) {
            console.error('Failed to check Ollama service health:', error);
        }
    });
}
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    yield executeOllamaCommand();
}));
exports.default = app;
