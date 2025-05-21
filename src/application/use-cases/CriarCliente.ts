import { Cliente } from '../../domain/entities/Cliente';
import { ClienteRepository } from '../../domain/repositories/ClienteRepository';

interface CriarClienteDTO {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    vendedorId?: string;
}

export class CriarCliente {
    constructor(private clienteRepo: ClienteRepository) {}

    async executar(dados: CriarClienteDTO): Promise<Cliente> {
        if (!dados.id || !dados.nome || !dados.email || !dados.telefone) {
            throw new Error('Dados inválidos para criar cliente');
        }

        const cliente = new Cliente(
            dados.id,
            dados.nome,
            dados.email,
            dados.telefone,
            dados.vendedorId
        );

        await this.clienteRepo.criar(cliente);
        return cliente;
    }
} 