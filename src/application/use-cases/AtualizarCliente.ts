import { Cliente } from '../../domain/entities/Cliente';
import { ClienteRepository } from '../../domain/repositories/ClienteRepository';

interface AtualizarClienteDTO {
    nome?: string;
    email?: string;
    telefone?: string;
    vendedorId?: string;
}

export class AtualizarCliente {
    constructor(private clienteRepo: ClienteRepository) {}

    async executar(id: string, dados: AtualizarClienteDTO): Promise<Cliente | null> {
        if (!id) {
            throw new Error('ID do cliente é obrigatório');
        }

        // Verifica se o cliente existe
        const clienteExistente = await this.clienteRepo.obterPorId(id);
        if (!clienteExistente) {
            throw new Error('Cliente não encontrado');
        }

        return await this.clienteRepo.atualizar(id, dados);
    }
} 