import { Tema } from "../../domain/entities/Tema";
import { TemaRepository } from "../../domain/repositories/TemaRepository";

export class CriarTema {
    constructor(private temaRepo: TemaRepository) {}

    async executar(dados: { id: string; nome: string; descricao: string; cor: string }): Promise<Tema> {
        if (!dados.id || !dados.nome || !dados.descricao || !dados.cor) {
            throw new Error('Dados inválidos para criar tema');
        }

        const tema = new Tema(
            dados.id,
            dados.nome,
            dados.descricao,
            dados.cor
        );

        await this.temaRepo.criar(tema);
        return tema;
    }
} 