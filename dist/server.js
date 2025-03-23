"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const MongoDB_1 = require("./infrastructure/database/MongoDB");
const PORT = Number(process.env.PORT) || 3001;
console.log('🚀 Iniciando servidor...');
console.log('📦 Conectando ao MongoDB...');
MongoDB_1.MongoDB.conectar()
    .then(() => {
    console.log('🔌 MongoDB conectado com sucesso!');
    console.log('🎯 Iniciando servidor na porta', PORT);
    app_1.default.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
})
    .catch((error) => {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map