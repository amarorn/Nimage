"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vendedorRoutes_1 = __importDefault(require("./interfaces/routes/vendedorRoutes"));
const atividadeRoutes_1 = __importDefault(require("./interfaces/routes/atividadeRoutes"));
const equipeRoutes_1 = __importDefault(require("./interfaces/routes/equipeRoutes"));
const metaRoutes_1 = __importDefault(require("./interfaces/routes/metaRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Adicionando o endpoint de health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", message: "Service is running smoothly" });
});
app.use("/api", vendedorRoutes_1.default);
app.use("/api", atividadeRoutes_1.default);
app.use("/api", equipeRoutes_1.default);
app.use("/api", metaRoutes_1.default);
exports.default = app;
