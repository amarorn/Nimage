import { MetaRepository } from "../../domain/repositories/MetaRepository";
import { Meta } from "../../domain/entities/Meta";

export class AtualizarMeta {
    constructor(private metaRepo: MetaRepository) {}

    async executar(id: string, dados: { equipeId: string; objetivo: number; data: Date }): Promise<Meta | null> {
        //console.log("📝 Iniciando atualização de meta com dados:", dados);

        if (!dados.equipeId || dados.objetivo === undefined || !dados.data) {
            throw new Error('Dados inválidos para atualizar meta');
        }

        if (dados.objetivo < 0) {
            throw new Error('Objetivo não pode ser negativo');
        }

        const metaAtualizada = await this.metaRepo.atualizar(id, dados);
        //console.log("💾 Meta atualizada no banco:", metaAtualizada);

        return metaAtualizada;
    }
} 