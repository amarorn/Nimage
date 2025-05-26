"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletarCliente = void 0;
class DeletarCliente {
    constructor(clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    async executar(id) {
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
exports.DeletarCliente = DeletarCliente;
//# sourceMappingURL=DeletarCliente.js.map