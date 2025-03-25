"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterAtividades = void 0;
const AtividadeCacheService_1 = require("../../infrastructure/cache/AtividadeCacheService");
class ObterAtividades {
    constructor(atividadeRepo) {
        this.atividadeRepo = atividadeRepo;
        this.cacheService = AtividadeCacheService_1.AtividadeCacheService.getInstance();
    }
    async executar(skip, limit) {
        console.log('🔍 Buscando atividades com paginação:', { skip, limit });
        // Tenta obter do cache primeiro
        const cachedResult = await this.cacheService.getAtividadesPaginadas(skip, limit);
        if (cachedResult) {
            console.log('✅ Dados encontrados no cache');
            return cachedResult;
        }
        console.log('🔄 Cache miss, buscando do banco...');
        // Se não estiver no cache, busca do banco
        const [atividades, total] = await Promise.all([
            this.atividadeRepo.obterTodos(skip, limit),
            this.atividadeRepo.obterTotal()
        ]);
        const result = { atividades, total };
        // Salva no cache para próximas consultas
        console.log('💾 Salvando dados no cache...');
        await this.cacheService.setAtividadesPaginadas(skip, limit, result);
        console.log('✅ Dados salvos no cache');
        return result;
    }
    async executarPorId(id) {
        console.log('🔍 Buscando atividade por ID:', id);
        // Tenta obter do cache primeiro
        const cachedAtividade = await this.cacheService.getAtividade(id);
        if (cachedAtividade) {
            console.log('✅ Atividade encontrada no cache');
            return cachedAtividade;
        }
        console.log('🔄 Cache miss, buscando do banco...');
        // Se não estiver no cache, busca do banco
        const atividade = await this.atividadeRepo.obterPorId(id);
        if (atividade) {
            console.log('💾 Salvando atividade no cache...');
            await this.cacheService.setAtividade(atividade);
            console.log('✅ Atividade salva no cache');
        }
        return atividade;
    }
}
exports.ObterAtividades = ObterAtividades;
//# sourceMappingURL=ObterAtividades.js.map