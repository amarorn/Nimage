import { Montadora } from '../entities/Montadora';

export interface MontadoraRepository {
    criar(montadora: Montadora): Promise<Montadora>;
    atualizar(id: string, dados: Partial<Montadora>): Promise<Montadora | null>;
    obterPorId(id: string): Promise<Montadora | null>;
    obterTodos(skip: number, limit: number): Promise<Montadora[]>;
    deletar(id: string): Promise<void>;
} 