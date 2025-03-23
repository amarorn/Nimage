"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtividadeService = void 0;
class AtividadeService {
    constructor(atividadeRepo, vendedorRepo, equipeRepo, metaRepo) {
        this.atividadeRepo = atividadeRepo;
        this.vendedorRepo = vendedorRepo;
        this.equipeRepo = equipeRepo;
        this.metaRepo = metaRepo;
    }
    async obterAtividadesPorVendedorEData(vendedorId, dataInicio, dataFim) {
        // Busca atividades
        const atividades = await this.atividadeRepo.obterPorVendedorEData(vendedorId, dataInicio, dataFim);
        const quantidade = atividades.length;
        const valorTotal = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
        console.log('Debug - Buscando vendedor com ID:', vendedorId);
        // Busca informações do vendedor
        const vendedor = await this.vendedorRepo.obterPorId(vendedorId);
        console.log('Debug - Resultado da busca do vendedor:', vendedor);
        if (!vendedor) {
            throw new Error('Vendedor não encontrado');
        }
        // Busca informações da equipe
        const equipe = await this.equipeRepo.obterPorId(vendedor.equipeId);
        if (!equipe) {
            throw new Error('Equipe não encontrada');
        }
        // Busca meta da equipe
        const meta = await this.metaRepo.obterPorEquipe(equipe.id);
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