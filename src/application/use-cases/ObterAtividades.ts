import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";

export class ObterAtividades {
    constructor(private atividadeRepo: AtividadeRepository) {}

    async executar(skip: number, limit: number) {
        console.log("Executando ObterAtividades com paginação", { skip, limit });
        return await this.atividadeRepo.obterTodos(skip, limit);
    }
}