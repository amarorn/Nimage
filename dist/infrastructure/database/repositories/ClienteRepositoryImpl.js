"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteRepositoryImpl = void 0;
const Cliente_1 = require("../../../domain/entities/Cliente");
const ClienteModel_1 = require("../models/ClienteModel");
class ClienteRepositoryImpl {
    async criar(cliente) {
        const novoCliente = new ClienteModel_1.ClienteModel({
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone,
            vendedorId: cliente.vendedorId
        });
        await novoCliente.save();
        return cliente;
    }
    async atualizar(id, dados) {
        const cliente = await ClienteModel_1.ClienteModel.findOneAndUpdate({ id }, { $set: dados }, { new: true });
        if (!cliente)
            return null;
        return new Cliente_1.Cliente(cliente.id, cliente.nome, cliente.email, cliente.telefone, cliente.vendedorId);
    }
    async obterPorId(id) {
        const cliente = await ClienteModel_1.ClienteModel.findOne({ id });
        if (!cliente)
            return null;
        return new Cliente_1.Cliente(cliente.id, cliente.nome, cliente.email, cliente.telefone, cliente.vendedorId);
    }
    async obterPorEmail(email) {
        const cliente = await ClienteModel_1.ClienteModel.findOne({ email });
        if (!cliente)
            return null;
        return new Cliente_1.Cliente(cliente.id, cliente.nome, cliente.email, cliente.telefone, cliente.vendedorId);
    }
    async obterPorTelefone(telefone) {
        const cliente = await ClienteModel_1.ClienteModel.findOne({ telefone });
        if (!cliente)
            return null;
        return new Cliente_1.Cliente(cliente.id, cliente.nome, cliente.email, cliente.telefone, cliente.vendedorId);
    }
    async obterPorVendedorId(vendedorId) {
        const clientes = await ClienteModel_1.ClienteModel.find({ vendedorId });
        return clientes.map(cliente => new Cliente_1.Cliente(cliente.id, cliente.nome, cliente.email, cliente.telefone, cliente.vendedorId));
    }
    async obterTodos(skip, limit) {
        const clientes = await ClienteModel_1.ClienteModel.find()
            .skip(skip)
            .limit(limit);
        return clientes.map(cliente => new Cliente_1.Cliente(cliente.id, cliente.nome, cliente.email, cliente.telefone, cliente.vendedorId));
    }
    async obterTotal() {
        return await ClienteModel_1.ClienteModel.countDocuments();
    }
    async deletar(id) {
        await ClienteModel_1.ClienteModel.findOneAndDelete({ id });
    }
}
exports.ClienteRepositoryImpl = ClienteRepositoryImpl;
//# sourceMappingURL=ClienteRepositoryImpl.js.map