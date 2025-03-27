import { Tema } from "../../domain/entities/Tema";
import { TemaRepository } from "../../domain/repositories/TemaRepository";

export class AtualizarTema {
    constructor(private temaRepo: TemaRepository) {}

    async executar(id: string, dados: { nome: string; descricao: string; cor: string }): Promise<Tema | null> {
        if (!dados.nome || !dados.descricao || !dados.cor) {
            throw new Error('Dados inválidos para atualizar tema');
        }

        return await this.temaRepo.atualizar(id, dados);
    }
} 