import { Montadora } from '../../domain/entities/Montadora';
import { MontadoraRepository } from '../../domain/repositories/MontadoraRepository';

interface CriarMontadoraDTO {
    id: string;
    razaoSocial: string;
    nomeFantasia: string;
    cnpj: string;
    telefoneFixo: string;
}

export class CriarMontadora {
    constructor(private montadoraRepo: MontadoraRepository) {}

    async executar(dados: CriarMontadoraDTO): Promise<Montadora> {
        if (!dados.id || !dados.razaoSocial || !dados.nomeFantasia || !dados.cnpj || !dados.telefoneFixo) {
            throw new Error('Dados obrigatórios ausentes');
        }
        const montadora = new Montadora(
            dados.id,
            dados.razaoSocial,
            dados.nomeFantasia,
            dados.cnpj,
            dados.telefoneFixo
        );
        return await this.montadoraRepo.criar(montadora);
    }
} 