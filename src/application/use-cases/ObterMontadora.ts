import { Montadora } from '../../domain/entities/Montadora';
import { MontadoraRepository } from '../../domain/repositories/MontadoraRepository';

export class ObterMontadora {
    constructor(private montadoraRepo: MontadoraRepository) {}

    async executar(skip: number, limit: number): Promise<Montadora[]> {
        return await this.montadoraRepo.obterTodos(skip, limit);
    }

    async executarPorId(id: string): Promise<Montadora | null> {
        return await this.montadoraRepo.obterPorId(id);
    }
} 