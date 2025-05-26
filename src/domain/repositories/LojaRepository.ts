import { Loja } from "../entities/Loja";

export interface LojaRepository {
    criar(loja: Loja): Promise<void>;
    atualizar(id: string, dados: Partial<Loja>): Promise<Loja | null>;
    obterPorId(id: string): Promise<Loja | null>;
    obterTodos(skip: number, limit: number): Promise<Loja[]>;
    deletar(id: string): Promise<void>;
    obterTotal(): Promise<number>;
} 