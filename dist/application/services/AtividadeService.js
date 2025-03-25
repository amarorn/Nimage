"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtividadeService = void 0;
const AtividadeCacheService_1 = require("../../infrastructure/cache/AtividadeCacheService");
class AtividadeService {
    constructor(atividadeRepo, vendedorRepo, equipeRepo, metaRepo) {
        this.atividadeRepo = atividadeRepo;
        this.vendedorRepo = vendedorRepo;
        this.equipeRepo = equipeRepo;
        this.metaRepo = metaRepo;
        this.cacheService = AtividadeCacheService_1.AtividadeCacheService.getInstance();
    }
    async obterAtividadesPorVendedorEData(vendedorId, dataInicio, dataFim) {
        // Tenta obter do cache primeiro
        const cacheKey = `${vendedorId}:${dataInicio.toISOString()}:${dataFim.toISOString()}`;
        const cachedResult = await this.cacheService.getAtividadesPorVendedorEData(vendedorId, dataInicio, dataFim);
        if (cachedResult) {
            const quantidade = cachedResult.length;
            const valorTotal = cachedResult.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
            // Busca informações do vendedor, equipe e meta em paralelo
            const [vendedor, equipe, meta] = await Promise.all([
                this.vendedorRepo.obterPorId(vendedorId),
                this.equipeRepo.obterPorId(vendedorId),
                this.metaRepo.obterPorEquipe(vendedorId)
            ]);
            if (!vendedor || !equipe) {
                throw new Error('Vendedor ou equipe não encontrado');
            }
            return {
                quantidade,
                valorTotal,
                vendedor: {
                    id: vendedor.id,
                    nome: vendedor.nome,
                    equipeId: vendedor.equipeId
                },
                equipe: {
                    id: equipe.id,
                    nome: equipe.nome
                },
                meta: meta ? {
                    id: meta.id,
                    equipeId: meta.equipeId,
                    objetivo: meta.objetivo,
                    data: meta.data
                } : null
            };
        }
        // Se não estiver no cache, busca do banco
        const [atividades, vendedor, equipe, meta] = await Promise.all([
            this.atividadeRepo.obterPorVendedorEData(vendedorId, dataInicio, dataFim),
            this.vendedorRepo.obterPorId(vendedorId),
            this.equipeRepo.obterPorId(vendedorId),
            this.metaRepo.obterPorEquipe(vendedorId)
        ]);
        if (!vendedor || !equipe) {
            throw new Error('Vendedor ou equipe não encontrado');
        }
        const quantidade = atividades.length;
        const valorTotal = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
        // Salva no cache para próximas consultas
        await this.cacheService.setAtividadesPorVendedorEData(vendedorId, dataInicio, dataFim, atividades);
        return {
            quantidade,
            valorTotal,
            vendedor: {
                id: vendedor.id,
                nome: vendedor.nome,
                equipeId: vendedor.equipeId
            },
            equipe: {
                id: equipe.id,
                nome: equipe.nome
            },
            meta: meta ? {
                id: meta.id,
                equipeId: meta.equipeId,
                objetivo: meta.objetivo,
                data: meta.data
            } : null
        };
    }
    async calcularFEA(equipeId, totalDiasDisponiveis, diasComAtividade) {
        if (diasComAtividade === 0) {
            return 0;
        }
        const fea = (totalDiasDisponiveis / diasComAtividade) * 100;
        return fea;
    }
}
exports.AtividadeService = AtividadeService;
//# sourceMappingURL=AtividadeService.js.map