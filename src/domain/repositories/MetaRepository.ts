import { Meta } from "../entities/Meta";

export interface MetaRepository {
    criar(meta: Meta): Promise<void>;
    obterPorEquipe(equipeId: string): Promise<Meta | null>;
    obterTodos(skip: number, limit: number): Promise<Meta[]>;
}