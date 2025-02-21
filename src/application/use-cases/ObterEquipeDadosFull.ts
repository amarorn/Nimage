import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";

export class ObterEquipeDadosFull {
    constructor(
        private equipeRepo: EquipeRepositoryImpl,
        private vendedorRepo: VendedorRepositoryImpl,
        private atividadeRepo: AtividadeRepositoryImpl,
        private metaRepo: MetaRepositoryImpl
    ) {}

    async executar(equipeId: string) {
        console.log("🔍 Buscando dados completos da equipe:", equipeId);

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
        const vendedoresComAtividades = await Promise.all(
            vendedores.map(async (vendedor) => {
                const atividades = await this.atividadeRepo.obterPorVendedorId(vendedor.id);
                return {
                    id: vendedor.id,
                    nome: vendedor.nome,
                    equipe_id: vendedor.equipe_id,
                    atividades: atividades.map(atividade => ({
                        id: atividade.id,
                        data: atividade.data,
                        docinhosCoco: atividade.docinhosCoco
                    }))
                };
            })
        );

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