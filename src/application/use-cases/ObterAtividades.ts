import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";
import { Atividade } from "../../domain/entities/Atividade";
import { AtividadeCacheService } from "../../infrastructure/cache/AtividadeCacheService";

export class ObterAtividades {
    private cacheService: AtividadeCacheService;

    constructor(private atividadeRepo: AtividadeRepository) {
        this.cacheService = AtividadeCacheService.getInstance();
    }

    async executar(skip: number, limit: number): Promise<{ atividades: Atividade[], total: number }> {
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

    async executarPorId(id: string): Promise<Atividade | null> {
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