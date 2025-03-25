import app from "./app";
import { MongoDB } from "./infrastructure/database/MongoDB";
import { CacheInitializer } from "./infrastructure/cache/CacheInitializer";
import { EquipeRepositoryImpl } from './infrastructure/repositories/EquipeRepositoryImpl';
import { VendedorRepositoryImpl } from './infrastructure/repositories/VendedorRepositoryImpl';
import { MetaRepositoryImpl } from './infrastructure/repositories/MetaRepositoryImpl';
import { AtividadeRepositoryImpl } from './infrastructure/repositories/AtividadeRepositoryImpl';

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
    try {
        console.log('🚀 Iniciando servidor...');
        
        // Conecta ao MongoDB
        console.log('📦 Conectando ao MongoDB...');
        await MongoDB.conectar();
        console.log('🔌 MongoDB conectado com sucesso!');
        
        // Inicializa os repositórios
        const equipeRepo = new EquipeRepositoryImpl();
        const vendedorRepo = new VendedorRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl();
        const atividadeRepo = new AtividadeRepositoryImpl();

        // Inicializa o cache
        console.log('🔄 Inicializando cache...');
        const cacheInitializer = CacheInitializer.getInstance(
            equipeRepo,
            vendedorRepo,
            metaRepo,
            atividadeRepo
        );
        await cacheInitializer.initialize();
        console.log('✅ Cache inicializado com sucesso!');

        // Inicia o servidor HTTP
        console.log('🎯 Iniciando servidor na porta', PORT);
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
            console.log(`🔍 Health check disponível em http://localhost:${PORT}/api/health`);
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Erro não capturado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Promessa rejeitada não tratada:', error);
    process.exit(1);
});

// Inicia o servidor
startServer();