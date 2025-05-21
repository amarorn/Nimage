import { Tema } from "../../domain/entities/Tema";
import { TemaRepository } from "../../domain/repositories/TemaRepository";
import { v4 as uuidv4 } from 'uuid';

export class CriarTema {
    constructor(private temaRepo: TemaRepository) {}

    async executar(dados: { nome: string; descricao: string; cor: string }): Promise<Tema> {
        if (!dados.nome || !dados.descricao || !dados.cor) {
            throw new Error('Dados inválidos para criar tema');
        }

        const tema = new Tema(
            uuidv4(),
            dados.nome,
            dados.descricao,
            dados.cor
        );

        await this.temaRepo.criar(tema);
        return tema;
    }
} 