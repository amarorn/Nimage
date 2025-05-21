import { Cliente } from '../../../domain/entities/Cliente';
import { ClienteRepository } from '../../../domain/repositories/ClienteRepository';
import { ClienteModel } from '../models/ClienteModel';

export class ClienteRepositoryImpl implements ClienteRepository {
    async criar(cliente: Cliente): Promise<Cliente> {
        const novoCliente = new ClienteModel({
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone,
            vendedorId: cliente.vendedorId
        });

        await novoCliente.save();
        return cliente;
    }

    async atualizar(id: string, dados: Partial<Cliente>): Promise<Cliente | null> {
        const cliente = await ClienteModel.findOneAndUpdate(
            { id },
            { $set: dados },
            { new: true }
        );

        if (!cliente) return null;

        return new Cliente(
            cliente.id,
            cliente.nome,
            cliente.email,
            cliente.telefone,
            cliente.vendedorId
        );
    }

    async obterPorId(id: string): Promise<Cliente | null> {
        const cliente = await ClienteModel.findOne({ id });
        if (!cliente) return null;

        return new Cliente(
            cliente.id,
            cliente.nome,
            cliente.email,
            cliente.telefone,
            cliente.vendedorId
        );
    }

    async obterPorEmail(email: string): Promise<Cliente | null> {
        const cliente = await ClienteModel.findOne({ email });
        if (!cliente) return null;

        return new Cliente(
            cliente.id,
            cliente.nome,
            cliente.email,
            cliente.telefone,
            cliente.vendedorId
        );
    }

    async obterPorTelefone(telefone: string): Promise<Cliente | null> {
        const cliente = await ClienteModel.findOne({ telefone });
        if (!cliente) return null;

        return new Cliente(
            cliente.id,
            cliente.nome,
            cliente.email,
            cliente.telefone,
            cliente.vendedorId
        );
    }

    async obterPorVendedorId(vendedorId: string): Promise<Cliente[]> {
        const clientes = await ClienteModel.find({ vendedorId });
        return clientes.map(cliente => new Cliente(
            cliente.id,
            cliente.nome,
            cliente.email,
            cliente.telefone,
            cliente.vendedorId
        ));
    }

    async obterTodos(skip: number, limit: number): Promise<Cliente[]> {
        const clientes = await ClienteModel.find()
            .skip(skip)
            .limit(limit);

        return clientes.map(cliente => new Cliente(
            cliente.id,
            cliente.nome,
            cliente.email,
            cliente.telefone,
            cliente.vendedorId
        ));
    }

    async obterTotal(): Promise<number> {
        return await ClienteModel.countDocuments();
    }

    async deletar(id: string): Promise<void> {
        await ClienteModel.findOneAndDelete({ id });
    }
} 