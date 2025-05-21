import { ClienteRepository } from '../../domain/repositories/ClienteRepository';

export class DeletarCliente {
    constructor(private clienteRepository: ClienteRepository) {}

    async executar(id: string): Promise<void> {
        if (!id) {
            throw new Error('ID do cliente é obrigatório');
        }

        const cliente = await this.clienteRepository.obterPorId(id);
        if (!cliente) {
            throw new Error('Cliente não encontrado');
        }

        await this.clienteRepository.deletar(id);
    }
} 