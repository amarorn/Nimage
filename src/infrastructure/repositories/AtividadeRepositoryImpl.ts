import { Atividade } from "../../domain/entities/Atividade";
import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";

export class AtividadeRepositoryImpl implements AtividadeRepository {
    private atividades: Atividade[] = [];

    async criar(atividade: Atividade): Promise<void> {
        this.atividades.push(atividade);
    }

    async obterPorId(id: string): Promise<Atividade | null> {
        return this.atividades.find(a => a.id === id) || null;
    }

    async obterPorVendedor(vendedorId: string): Promise<Atividade[]> {
        return this.atividades.filter(a => a.vendedorId === vendedorId);
    }
}