"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterCliente = void 0;
class ObterCliente {
    constructor(clienteRepo) {
        this.clienteRepo = clienteRepo;
    }
    async executar(paginacao) {
        const skip = (paginacao.pagina - 1) * paginacao.limite;
        const [clientes, total] = await Promise.all([
            this.clienteRepo.obterTodos(skip, paginacao.limite),
            this.clienteRepo.obterTotal()
        ]);
        return { clientes, total };
    }
    async executarPorId(id) {
        return await this.clienteRepo.obterPorId(id);
    }
    async executarPorEmail(email) {
        return await this.clienteRepo.obterPorEmail(email);
    }
    async executarPorTelefone(telefone) {
        return await this.clienteRepo.obterPorTelefone(telefone);
    }
    async executarPorVendedorId(vendedorId) {
        return await this.clienteRepo.obterPorVendedorId(vendedorId);
    }
}
exports.ObterCliente = ObterCliente;
//# sourceMappingURL=ObterCliente.js.map