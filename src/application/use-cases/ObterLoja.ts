import { Loja } from '../../domain/entities/Loja';
import { LojaRepository } from '../../domain/repositories/LojaRepository';

export class ObterLoja {
    constructor(private lojaRepo: LojaRepository) {}

    async executar(skip: number, limit: number): Promise<{ lojas: Loja[]; total: number }> {
        const [lojas, total] = await Promise.all([
            this.lojaRepo.obterTodos(skip, limit),
            this.lojaRepo.obterTotal()
        ]);
        return { lojas, total };
    }

    async executarPorId(id: string): Promise<Loja | null> {
        return await this.lojaRepo.obterPorId(id);
    }
} 