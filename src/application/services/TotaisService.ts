import { MetaRepository } from "../../domain/repositories/MetaRepository";
import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";

export class TotaisService {
    constructor(
        private metaRepository: MetaRepository,
        private atividadeRepository: AtividadeRepository
    ) {}

    async calcularTotaisPorEquipe(equipeId: string) {
        const metas = await this.metaRepository.obterPorEquipe(equipeId);
        const atividades = await this.atividadeRepository.obterAtividadesPorEquipe(equipeId);

        const totalMetas = metas ? metas.objetivo : 0;
        const totalDocinhosCoco = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);

        return {
            totalMetas,
            totalDocinhosCoco
        };
    }
} 