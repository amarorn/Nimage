"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarVendedor = void 0;
class AtualizarVendedor {
    constructor(vendedorRepository) {
        this.vendedorRepository = vendedorRepository;
    }
    async executar(id, dados) {
        if (!id) {
            throw new Error('ID do vendedor é obrigatório');
        }
        // Verifica se o vendedor existe
        const vendedorExistente = await this.vendedorRepository.obterPorId(id);
        if (!vendedorExistente) {
            throw new Error('Vendedor não encontrado');
        }
        // Filtra apenas os campos que foram fornecidos
        const dadosAtualizacao = {};
        if (dados.nome !== undefined)
            dadosAtualizacao.nome = dados.nome;
        if (dados.equipeId !== undefined)
            dadosAtualizacao.equipeId = dados.equipeId;
        if (dados.email !== undefined)
            dadosAtualizacao.email = dados.email;
        if (dados.telefone !== undefined)
            dadosAtualizacao.telefone = dados.telefone;
        if (dados.meta !== undefined)
            dadosAtualizacao.meta = dados.meta;
        if (dados.cargo !== undefined)
            dadosAtualizacao.cargo = dados.cargo;
        return await this.vendedorRepository.atualizar(id, dadosAtualizacao);
    }
}
exports.AtualizarVendedor = AtualizarVendedor;
//# sourceMappingURL=AtualizarVendedor.js.map