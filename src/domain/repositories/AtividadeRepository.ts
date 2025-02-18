import { Atividade } from "../entities/Atividade";

export interface AtividadeRepository {
    criar(atividade: Atividade): Promise<void>;
    obterPorId(id: string): Promise<Atividade | null>;
    obterTodos(skip: number, limit: number): Promise<Atividade[]>;
}