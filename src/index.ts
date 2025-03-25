import express from "express";
import vendedorRoutes from "./interfaces/routes/vendedorRoutes";
import { MongoDB } from './infrastructure/database/MongoDB';
import { CacheInitializer } from './infrastructure/cache/CacheInitializer';
import { EquipeRepositoryImpl } from './infrastructure/repositories/EquipeRepositoryImpl';
import { VendedorRepositoryImpl } from './infrastructure/repositories/VendedorRepositoryImpl';
import { MetaRepositoryImpl } from './infrastructure/repositories/MetaRepositoryImpl';
import { AtividadeRepositoryImpl } from './infrastructure/repositories/AtividadeRepositoryImpl';

const app = express();

// Middleware de logging
app.use((req, res, next) => {
    //console.log(`📝 ${req.method} ${req.url}`);
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        //console.log(`🕒 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

app.use(express.json());
app.use("/api", vendedorRoutes);

const PORT = process.env.PORT || 3001;

async function bootstrap() {
    try {
        // Conecta ao MongoDB
        await MongoDB.conectar();
        console.log('✅ Conectado ao MongoDB');

        // Inicializa os repositórios
        const equipeRepo = new EquipeRepositoryImpl();
        const vendedorRepo = new VendedorRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl();
        const atividadeRepo = new AtividadeRepositoryImpl();

        // Inicializa o cache
        const cacheInitializer = CacheInitializer.getInstance(
            equipeRepo,
            vendedorRepo,
            metaRepo,
            atividadeRepo
        );
        await cacheInitializer.initialize();

        // Inicia o servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
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
