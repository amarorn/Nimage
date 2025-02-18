"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vendedorRoutes_1 = __importDefault(require("./interfaces/routes/vendedorRoutes"));
const app = (0, express_1.default)();
// Middleware de logging
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.url}`);
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`🕒 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});
app.use(express_1.default.json());
app.use("/api", vendedorRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
