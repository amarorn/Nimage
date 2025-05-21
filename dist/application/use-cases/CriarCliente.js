"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarCliente = void 0;
const Cliente_1 = require("../../domain/entities/Cliente");
class CriarCliente {
    constructor(clienteRepo) {
        this.clienteRepo = clienteRepo;
    }
    async executar(dados) {
        if (!dados.id || !dados.nome || !dados.email || !dados.telefone) {
            throw new Error('Dados inválidos para criar cliente');
        }
        const cliente = new Cliente_1.Cliente(dados.id, dados.nome, dados.email, dados.telefone, dados.vendedorId);
        await this.clienteRepo.criar(cliente);
        return cliente;
    }
}
exports.CriarCliente = CriarCliente;
//# sourceMappingURL=CriarCliente.js.map