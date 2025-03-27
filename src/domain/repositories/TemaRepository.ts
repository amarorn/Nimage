import { Tema } from "../entities/Tema";

export interface TemaRepository {
    criar(tema: Tema): Promise<void>;
    atualizar(id: string, dados: { nome: string; descricao: string; cor: string }): Promise<Tema | null>;
    obterPorId(id: string): Promise<Tema | null>;
    obterTodos(skip: number, limit: number): Promise<Tema[]>;
    deletar(id: string): Promise<void>;
    obterTotal(): Promise<number>;
} 