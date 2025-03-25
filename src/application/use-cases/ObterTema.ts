import { Tema } from "../../domain/entities/Tema";
import { TemaRepository } from "../../domain/repositories/TemaRepository";

export class ObterTema {
    constructor(private temaRepo: TemaRepository) {}

    async executar(skip: number, limit: number): Promise<{ temas: Tema[], total: number }> {
        const [temas, total] = await Promise.all([
            this.temaRepo.obterTodos(skip, limit),
            this.temaRepo.obterTotal()
        ]);
        return { temas, total };
    }

    async executarPorId(id: string): Promise<Tema | null> {
        return await this.temaRepo.obterPorId(id);
    }
} 