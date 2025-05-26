"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarCliente = void 0;
const Cliente_1 = require("../../domain/entities/Cliente");
class CriarCliente {
    constructor(clienteRepo) {
        this.clienteRepo = clienteRepo;
    }
    async executar(dados) {
        var _a;
        if (!dados.id || !dados.nome || !dados.email || !dados.telefone) {
            throw new Error('Dados inválidos para criar cliente');
        }
        const cliente = new Cliente_1.Cliente(dados.id, dados.nome, dados.email, dados.telefone, (_a = dados.vendedorId) !== null && _a !== void 0 ? _a : '');
        await this.clienteRepo.criar(cliente);
        return cliente;
    }
}
exports.CriarCliente = CriarCliente;
//# sourceMappingURL=CriarCliente.js.map