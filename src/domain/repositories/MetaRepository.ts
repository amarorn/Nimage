import { Meta } from "../entities/Meta";

export interface MetaRepository {
    criar(meta: Meta): Promise<void>;
    atualizar(id: string, dados: { equipeId: string; objetivo: number }): Promise<Meta | null>;
    obterPorEquipe(equipeId: string): Promise<Meta | null>;
    obterPorId(id: string): Promise<Meta | null>;
    obterTodos(skip: number, limit: number): Promise<Meta[]>;
}