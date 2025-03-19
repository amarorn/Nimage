import app from "./app";
import { MongoDB } from "./infrastructure/database/MongoDB";

        const PORT = Number(process.env.PORT) || 3001;

console.log('🚀 Iniciando servidor...');
console.log('📦 Conectando ao MongoDB...');

MongoDB.conectar()
    .then(() => {
        console.log('🔌 MongoDB conectado com sucesso!');
        console.log('🎯 Iniciando servidor na porta', PORT);
            app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    });