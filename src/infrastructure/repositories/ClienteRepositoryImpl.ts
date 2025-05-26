import { ClienteRepository } from '../../domain/repositories/ClienteRepository';
import { ClienteModel, Cliente } from '../database/models/ClienteModel';
import { MongoDB } from '../database/MongoDB';

export class ClienteRepositoryImpl implements ClienteRepository {
    async criar(cliente: Cliente): Promise<Cliente> {
        await MongoDB.trackOperation('criar', 'clientes', async () => {
            await ClienteModel.create({
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                telefone: cliente.telefone,
                vendedorId: cliente.vendedorId
            });
        });
        return cliente;
    }

    async atualizar(id: string, dados: Partial<Cliente>): Promise<Cliente | null> {
        return await MongoDB.trackOperation('atualizar', 'clientes', async () => {
            const clienteAtualizado = await ClienteModel.findOneAndUpdate(
                { id },
                { $set: dados },
                { new: true }
            );

            if (!clienteAtualizado) return null;

            return this.toDomain(clienteAtualizado);
        });
    }

    async obterPorId(id: string): Promise<Cliente | null> {
        return await MongoDB.trackOperation('obterPorId', 'clientes', async () => {
            const cliente = await ClienteModel.findOne({ id });
            if (!cliente) return null;
            return this.toDomain(cliente);
        });
    }

    async obterTodos(skip: number, limit: number): Promise<Cliente[]> {
        return await MongoDB.trackOperation('obterTodos', 'clientes', async () => {
            const clientes = await ClienteModel.find()
                .skip(skip)
                .limit(limit)
                .sort({ dataCadastro: -1 });

            return clientes.map(cliente => this.toDomain(cliente));
        });
    }

    async obterPorEmail(email: string): Promise<Cliente | null> {
        return await MongoDB.trackOperation('obterPorEmail', 'clientes', async () => {
            const cliente = await ClienteModel.findOne({ email });
            if (!cliente) return null;
            return this.toDomain(cliente);
        });
    }

    async obterPorTelefone(telefone: string): Promise<Cliente | null> {
        return await MongoDB.trackOperation('obterPorTelefone', 'clientes', async () => {
            const cliente = await ClienteModel.findOne({ telefone });
            if (!cliente) return null;
            return this.toDomain(cliente);
        });
    }

    async deletar(id: string): Promise<void> {
        await MongoDB.trackOperation('deletar', 'clientes', async () => {
            await ClienteModel.deleteOne({ id });
        });
    }

    async obterTotal(): Promise<number> {
        return await MongoDB.trackOperation('obterTotal', 'clientes', async () => {
            return await ClienteModel.countDocuments();
        });
    }

    async obterPorVendedorId(vendedorId: string): Promise<Cliente[]> {
        return await MongoDB.trackOperation('obterPorVendedorId', 'clientes', async () => {
            const clientes = await ClienteModel.find({ vendedorId });
            return clientes.map(cliente => this.toDomain(cliente));
        });
    }

    private toDomain(cliente: any): Cliente {
        return new Cliente(
            cliente.id,
            cliente.nome,
            cliente.email,
            cliente.telefone,
            cliente.vendedorId ?? ''
        );
    }
} 