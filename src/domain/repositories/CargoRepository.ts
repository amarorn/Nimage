import { Cargo } from "../entities/Cargo";

export interface CargoRepository {
    criar(cargo: Cargo): Promise<void>;
    atualizar(id: string, dados: { nome: string; descricao: string; tag: string }): Promise<Cargo | null>;
    obterPorId(id: string): Promise<Cargo | null>;
    obterTodos(skip: number, limit: number): Promise<Cargo[]>;
    deletar(id: string): Promise<void>;
    obterTotal(): Promise<number>;
} 