import { EquipeRepository } from "../../domain/repositories/EquipeRepository";

export class ObterEquipe {
    constructor(private equipeRepo: EquipeRepository) {}

    async executar(skip: number, limit: number) {
        console.log("Executando ObterEquipe com paginação", { skip, limit });
        return await this.equipeRepo.obterTodos(skip, limit);
    }
} 