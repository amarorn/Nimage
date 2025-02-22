import { EquipeRepository } from "../../domain/repositories/EquipeRepository";
import { Equipe } from "../../domain/entities/Equipe";

export class AtualizarEquipe {
    constructor(private equipeRepo: EquipeRepository) {}

    async executar(id: string, dados: { nome: string }): Promise<Equipe | null> {
        console.log("📝 Iniciando atualização de equipe com dados:", dados);

        if (!dados.nome) {
            throw new Error('Dados inválidos para atualizar equipe');
        }

        const equipeAtualizada = await this.equipeRepo.atualizar(id, dados);
        console.log("💾 Equipe atualizada no banco:", equipeAtualizada);

        return equipeAtualizada;
    }
} 