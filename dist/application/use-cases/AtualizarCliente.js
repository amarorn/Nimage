"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarCliente = void 0;
class AtualizarCliente {
    constructor(clienteRepo) {
        this.clienteRepo = clienteRepo;
    }
    async executar(id, dados) {
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
exports.AtualizarCliente = AtualizarCliente;
//# sourceMappingURL=AtualizarCliente.js.map