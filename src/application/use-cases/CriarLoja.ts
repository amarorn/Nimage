import { Loja } from '../../domain/entities/Loja';
import { LojaRepository } from '../../domain/repositories/LojaRepository';

interface CriarLojaDTO {
    id: string;
    nome: string;
    cnpj: string;
    telefone: string;
    montadoraId: string;
}

export class CriarLoja {
    constructor(private lojaRepo: LojaRepository) {}

    async executar(dados: CriarLojaDTO): Promise<Loja> {
        if (!dados.id || !dados.nome || !dados.cnpj || !dados.telefone || !dados.montadoraId) {
            throw new Error('Dados inválidos para criar loja');
        }

        const loja = new Loja(
            dados.id,
            dados.nome,
            dados.cnpj,
            dados.telefone,
            dados.montadoraId
        );

        await this.lojaRepo.criar(loja);
        return loja;
    }
} 