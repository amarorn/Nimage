"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarCliente = void 0;
const Cliente_1 = require("../../../domain/entities/Cliente");
const uuid_1 = require("uuid");
class CriarCliente {
    constructor(clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    async execute(dados) {
        // Verificar se já existe um cliente com o mesmo email
        const clienteExistente = await this.clienteRepository.obterPorEmail(dados.email);
        if (clienteExistente) {
            throw new Error('Já existe um cliente cadastrado com este email');
        }
        // Criar novo cliente
        const cliente = new Cliente_1.Cliente((0, uuid_1.v4)(), dados.nome, dados.email, dados.telefone, dados.vendedorId);
        // Salvar no banco de dados
        return await this.clienteRepository.criar(cliente);
    }
}
exports.CriarCliente = CriarCliente;
//# sourceMappingURL=CriarCliente.js.map