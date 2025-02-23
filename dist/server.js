"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const MongoDB_1 = require("./infrastructure/database/MongoDB");
const PORT = process.env.PORT || 3000;
MongoDB_1.MongoDB.conectar().then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
});
