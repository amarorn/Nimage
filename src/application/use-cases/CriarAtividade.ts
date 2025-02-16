import { Atividade } from "../../domain/entities/Atividade";
import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";

export class CriarAtividade {
    constructor(private atividadeRepo: AtividadeRepository) {}

    async executar(dados: { id: string; vendedorId: string; data: Date; docinhosCoco: number }) {
        const atividade = new Atividade(dados.id, dados.vendedorId, dados.data, dados.docinhosCoco);
        await this.atividadeRepo.criar(atividade);
        return atividade;
    }
}