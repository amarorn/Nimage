"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterVendedor = void 0;
class ObterVendedor {
    constructor(vendedorRepository) {
        this.vendedorRepository = vendedorRepository;
    }
    async executar(skip, limit) {
        //console.log("Executando ObterVendedor com paginação", { skip, limit });
        return await this.vendedorRepository.obterTodos(skip, limit);
    }
    async executarPorId(id) {
        if (!id) {
            throw new Error('ID do vendedor é obrigatório');
        }
        //console.log("Executando ObterVendedor por ID", { id });
        return await this.vendedorRepository.obterPorId(id);
    }
    async executarPorEquipeId(equipeId) {
        if (!equipeId) {
            throw new Error('ID da equipe é obrigatório');
        }
        return await this.vendedorRepository.obterPorEquipeId(equipeId);
    }
}
exports.ObterVendedor = ObterVendedor;
//# sourceMappingURL=ObterVendedor.js.map