"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const MongoDB_1 = require("./infrastructure/database/MongoDB");
const CacheInitializer_1 = require("./infrastructure/cache/CacheInitializer");
const EquipeRepositoryImpl_1 = require("./infrastructure/repositories/EquipeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("./infrastructure/repositories/VendedorRepositoryImpl");
const MetaRepositoryImpl_1 = require("./infrastructure/repositories/MetaRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("./infrastructure/repositories/AtividadeRepositoryImpl");
const PORT = process.env.PORT || 3001;
async function bootstrap() {
    try {
        // Conecta ao MongoDB
        const mongoDB = MongoDB_1.MongoDB.getInstance();
        await mongoDB.connect();
        console.log('✅ Conectado ao MongoDB');
        // Inicializa os repositórios
        const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
        const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
        const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
        // Inicializa o cache
        const cacheInitializer = CacheInitializer_1.CacheInitializer.getInstance(equipeRepo, vendedorRepo, metaRepo, atividadeRepo);
        await cacheInitializer.initialize();
        // Inicia o servidor
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Erro ao iniciar a aplicação:', error);
        process.exit(1);
    }
}
bootstrap();
// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Erro não capturado:', error);
    process.exit(1);
});
process.on('unhandledRejection', (error) => {
    console.error('❌ Promessa rejeitada não tratada:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map