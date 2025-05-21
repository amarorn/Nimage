"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteRepositoryImpl = void 0;
const Cliente_1 = require("../../domain/entities/Cliente");
const ClienteModel_1 = require("../database/models/ClienteModel");
const MongoDB_1 = require("../database/MongoDB");
class ClienteRepositoryImpl {
    async criar(cliente) {
        await MongoDB_1.MongoDB.trackOperation('criar', 'clientes', async () => {
            await ClienteModel_1.ClienteModel.create({
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                telefone: cliente.telefone,
                vendedorId: cliente.vendedorId
            });
        });
        return cliente;
    }
    async atualizar(id, dados) {
        return await MongoDB_1.MongoDB.trackOperation('atualizar', 'clientes', async () => {
            const clienteAtualizado = await ClienteModel_1.ClienteModel.findOneAndUpdate({ id }, { $set: dados }, { new: true });
            if (!clienteAtualizado)
                return null;
            return this.toDomain(clienteAtualizado);
        });
    }
    async obterPorId(id) {
        return await MongoDB_1.MongoDB.trackOperation('obterPorId', 'clientes', async () => {
            const cliente = await ClienteModel_1.ClienteModel.findOne({ id });
            if (!cliente)
                return null;
            return this.toDomain(cliente);
        });
    }
    async obterTodos(skip, limit) {
        return await MongoDB_1.MongoDB.trackOperation('obterTodos', 'clientes', async () => {
            const clientes = await ClienteModel_1.ClienteModel.find()
                .skip(skip)
                .limit(limit)
                .sort({ dataCadastro: -1 });
            return clientes.map(cliente => this.toDomain(cliente));
        });
    }
    async obterPorEmail(email) {
        return await MongoDB_1.MongoDB.trackOperation('obterPorEmail', 'clientes', async () => {
            const cliente = await ClienteModel_1.ClienteModel.findOne({ email });
            if (!cliente)
                return null;
            return this.toDomain(cliente);
        });
    }
    async obterPorTelefone(telefone) {
        return await MongoDB_1.MongoDB.trackOperation('obterPorTelefone', 'clientes', async () => {
            const cliente = await ClienteModel_1.ClienteModel.findOne({ telefone });
            if (!cliente)
                return null;
            return this.toDomain(cliente);
        });
    }
    async deletar(id) {
        await MongoDB_1.MongoDB.trackOperation('deletar', 'clientes', async () => {
            await ClienteModel_1.ClienteModel.deleteOne({ id });
        });
    }
    async obterTotal() {
        return await MongoDB_1.MongoDB.trackOperation('obterTotal', 'clientes', async () => {
            return await ClienteModel_1.ClienteModel.countDocuments();
        });
    }
    async obterPorVendedorId(vendedorId) {
        return await MongoDB_1.MongoDB.trackOperation('obterPorVendedorId', 'clientes', async () => {
            const clientes = await ClienteModel_1.ClienteModel.find({ vendedorId });
            return clientes.map(cliente => this.toDomain(cliente));
        });
    }
    toDomain(cliente) {
        return new Cliente_1.Cliente(cliente.id, cliente.nome, cliente.email, cliente.telefone, cliente.vendedorId);
    }
}
exports.ClienteRepositoryImpl = ClienteRepositoryImpl;
//# sourceMappingURL=ClienteRepositoryImpl.js.map