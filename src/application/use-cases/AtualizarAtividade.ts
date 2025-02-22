import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";
import { Atividade } from "../../domain/entities/Atividade";

export class AtualizarAtividade {
    constructor(private atividadeRepo: AtividadeRepository) {}

    async executar(id: string, dados: { vendedorId: string; data: Date; docinhosCoco: number }): Promise<Atividade | null> {
        console.log("📝 Iniciando atualização de atividade com dados:", dados);

        if (!dados.vendedorId || !dados.data || dados.docinhosCoco === undefined) {
            throw new Error('Dados inválidos para atualizar atividade');
        }

        const atividadeAtualizada = await this.atividadeRepo.atualizar(id, dados);
        console.log("💾 Atividade atualizada no banco:", atividadeAtualizada);

        return atividadeAtualizada;
    }
} 