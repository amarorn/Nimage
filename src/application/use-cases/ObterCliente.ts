import { Cliente } from '../../domain/entities/Cliente';
import { ClienteRepository } from '../../domain/repositories/ClienteRepository';

interface PaginacaoDTO {
    pagina: number;
    limite: number;
}

export class ObterCliente {
    constructor(private clienteRepo: ClienteRepository) {}

    async executar(paginacao: PaginacaoDTO): Promise<{ clientes: Cliente[]; total: number }> {
        const skip = (paginacao.pagina - 1) * paginacao.limite;
        const [clientes, total] = await Promise.all([
            this.clienteRepo.obterTodos(skip, paginacao.limite),
            this.clienteRepo.obterTotal()
        ]);

        return { clientes, total };
    }

    async executarPorId(id: string): Promise<Cliente | null> {
        return await this.clienteRepo.obterPorId(id);
    }

    async executarPorEmail(email: string): Promise<Cliente | null> {
        return await this.clienteRepo.obterPorEmail(email);
    }

    async executarPorTelefone(telefone: string): Promise<Cliente | null> {
        return await this.clienteRepo.obterPorTelefone(telefone);
    }

    async executarPorVendedorId(vendedorId: string): Promise<Cliente[]> {
        return await this.clienteRepo.obterPorVendedorId(vendedorId);
    }
} 