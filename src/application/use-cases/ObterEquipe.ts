import { EquipeRepository } from "../../domain/repositories/EquipeRepository";
import { Equipe } from "../../domain/entities/Equipe";

export class ObterEquipe {
    constructor(private equipeRepo: EquipeRepository) {}

    async executar(skip: number, limit: number): Promise<Equipe[]> {
        console.log("Executando ObterEquipe com paginação", { skip, limit });
        return await this.equipeRepo.obterTodos(skip, limit);
    }

    async executarPorId(id: string): Promise<Equipe | null> {
        console.log("Executando ObterEquipe por ID", { id });
        return await this.equipeRepo.obterPorId(id);
    }
} 