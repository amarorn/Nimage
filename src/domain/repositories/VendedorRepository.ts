import { Vendedor } from "../entities/Vendedor";

export interface VendedorRepository {
    criar(vendedor: Vendedor): Promise<void>;
    obterPorId(id: string): Promise<Vendedor | null>;
    obterTodos(skip: number, limit: number): Promise<Vendedor[]>;
}