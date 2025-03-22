"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendasService = void 0;
class VendasService {
    constructor(vendedorRepository, vendasRepository) {
        this.vendedorRepository = vendedorRepository;
        this.vendasRepository = vendasRepository;
    }
    async obterTodosVendedores() {
        return this.vendedorRepository.obterTodos(0, Number.MAX_SAFE_INTEGER);
    }
    async calcularMetricasVendedor(vendedorId) {
        const vendas = await this.vendasRepository.obterPorVendedorId(vendedorId);
        const vendedor = await this.vendedorRepository.obterPorId(vendedorId);
        if (!vendedor) {
            throw new Error('Vendedor não encontrado');
        }
        const totalVendas = vendas.reduce((soma, venda) => soma + venda.valor, 0);
        const diasComAtividade = vendas.length;
        const mediaPorDia = diasComAtividade > 0 ? totalVendas / diasComAtividade : 0;
        // Cálculos simplificados para exemplo
        const fea = mediaPorDia > 100 ? 1.5 : mediaPorDia > 50 ? 1.0 : 0.5;
        const iap = mediaPorDia * fea;
        const metaEquipe = 1000; // Meta fixa para exemplo
        return {
            fea,
            iap,
            diasComAtividade,
            totalVendas,
            mediaPorDia,
            metaEquipe
        };
    }
}
exports.VendasService = VendasService;
//# sourceMappingURL=vendasService.js.map