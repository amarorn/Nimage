import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";
import { Atividade } from "../../domain/entities/Atividade";

export class ObterAtividades {
    constructor(private atividadeRepo: AtividadeRepository) {}

    async executar(skip: number, limit: number): Promise<Atividade[]> {
        //console.log("Executando ObterAtividades com paginação", { skip, limit });
        return await this.atividadeRepo.obterTodos(skip, limit);
    }

    async executarPorId(id: string): Promise<Atividade | null> {
        //console.log("Executando ObterAtividades por ID", { id });
        return await this.atividadeRepo.obterPorId(id);
    }
}