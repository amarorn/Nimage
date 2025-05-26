import { MontadoraRepository } from '../../domain/repositories/MontadoraRepository';

export class DeletarMontadora {
    constructor(private montadoraRepo: MontadoraRepository) {}

    async executar(id: string): Promise<void> {
        if (!id) throw new Error('ID da montadora é obrigatório');
        await this.montadoraRepo.deletar(id);
    }
} 