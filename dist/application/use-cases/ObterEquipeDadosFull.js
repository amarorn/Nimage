"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterEquipeDadosFull = void 0;
class ObterEquipeDadosFull {
    constructor(equipeRepo, vendedorRepo, atividadeRepo, metaRepo) {
        this.equipeRepo = equipeRepo;
        this.vendedorRepo = vendedorRepo;
        this.atividadeRepo = atividadeRepo;
        this.metaRepo = metaRepo;
    }
    async executar(equipeId) {
        //console.log("🔍 Buscando dados completos da equipe:", equipeId);
        // Busca a equipe
        const equipe = await this.equipeRepo.obterPorId(equipeId);
        if (!equipe) {
            throw new Error('Equipe não encontrada');
        }
        // Busca a meta da equipe
        const meta = await this.metaRepo.obterPorEquipe(equipeId);
        // Busca os vendedores da equipe
        const vendedores = await this.vendedorRepo.obterPorEquipeId(equipeId);
        // Para cada vendedor, busca suas atividades
        const vendedoresComAtividades = await Promise.all(vendedores.map(async (vendedor) => {
            const atividades = await this.atividadeRepo.obterPorVendedorId(vendedor.id);
            return {
                id: vendedor.id,
                nome: vendedor.nome,
                equipeId: vendedor.equipeId,
                atividades: atividades.map(atividade => ({
                    id: atividade.id,
                    data: atividade.data,
                    docinhosCoco: atividade.docinhosCoco,
                    total_docinhos: atividade.docinhosCoco
                }))
            };
        }));
        //console.log("🔍 Dados completos da equipe:", vendedoresComAtividades);
        return {
            equipe: {
                id: equipe.id,
                nome: equipe.nome
            },
            meta: meta ? {
                id: meta.id,
                objetivo: meta.objetivo
            } : null,
            vendedores: vendedoresComAtividades
        };
    }
}
exports.ObterEquipeDadosFull = ObterEquipeDadosFull;
//# sourceMappingURL=ObterEquipeDadosFull.js.map