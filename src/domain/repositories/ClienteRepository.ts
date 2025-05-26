import { Cliente } from '../entities/Cliente';

export interface ClienteRepository {
    criar(cliente: Cliente): Promise<Cliente>;
    atualizar(id: string, dados: Partial<Cliente>): Promise<Cliente | null>;
    obterPorId(id: string): Promise<Cliente | null>;
    obterPorEmail(email: string): Promise<Cliente | null>;
    obterPorTelefone(telefone: string): Promise<Cliente | null>;
    obterPorVendedorId(vendedorId: string): Promise<Cliente[]>;
    obterTodos(skip: number, limit: number): Promise<Cliente[]>;
    obterTotal(): Promise<number>;
    deletar(id: string): Promise<void>;
} 