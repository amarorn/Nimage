import { Montadora } from '../../domain/entities/Montadora';
import { MontadoraRepository } from '../../domain/repositories/MontadoraRepository';

export class AtualizarMontadora {
    constructor(private montadoraRepo: MontadoraRepository) {}

    async executar(id: string, dados: Partial<Montadora>): Promise<Montadora | null> {
        if (!id) throw new Error('ID da montadora é obrigatório');
        return await this.montadoraRepo.atualizar(id, dados);
    }
} 