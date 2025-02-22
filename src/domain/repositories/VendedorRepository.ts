import { Vendedor } from "../entities/Vendedor";

export interface VendedorRepository {
    criar(vendedor: Vendedor): Promise<void>;
    atualizar(id: string, dados: { nome: string; equipe_id: string }): Promise<Vendedor | null>;
    obterPorId(id: string): Promise<Vendedor | null>;
    obterTodos(skip: number, limit: number): Promise<Vendedor[]>;
    obterPorEquipeId(equipeId: string): Promise<Vendedor[]>;
}