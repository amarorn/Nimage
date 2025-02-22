import { Atividade } from "../entities/Atividade";

export interface AtividadeRepository {
    criar(atividade: Atividade): Promise<void>;
    atualizar(id: string, dados: { vendedorId: string; data: Date; docinhosCoco: number }): Promise<Atividade | null>;
    obterPorId(id: string): Promise<Atividade | null>;
    obterTodos(skip: number, limit: number): Promise<Atividade[]>;
    obterPorVendedorId(vendedorId: string): Promise<Atividade[]>;
}