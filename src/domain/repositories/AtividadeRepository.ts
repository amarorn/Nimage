import { Atividade } from "../entities/Atividade";

export interface AtividadeRepository {
    criar(atividade: Atividade): Promise<void>;
    atualizar(id: string, dados: { vendedorId: string; data: Date; docinhosCoco: number; follow_up: number; clienteId: string }): Promise<Atividade | null>;
    obterPorId(id: string): Promise<Atividade | null>;
    obterTodos(skip: number, limit: number): Promise<Atividade[]>;
    obterTotal(): Promise<number>;
    obterPorVendedorId(vendedorId: string): Promise<Atividade[]>;
    obterPorVendedorEData(vendedorId: string, dataInicio: Date, dataFim: Date): Promise<Atividade[]>;
    deletar(id: string): Promise<void>;
    deletarTodos(): Promise<void>;
}