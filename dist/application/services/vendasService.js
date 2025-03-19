"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendasService = void 0;
class VendasService {
    constructor(vendedorRepository, vendasRepository) {
        this.vendedorRepository = vendedorRepository;
        this.vendasRepository = vendasRepository;
    }
    obterTodosVendedores() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.vendedorRepository.obterTodos(0, Number.MAX_SAFE_INTEGER);
        });
    }
    calcularMetricasVendedor(vendedorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendas = yield this.vendasRepository.obterPorVendedorId(vendedorId);
            const vendedor = yield this.vendedorRepository.obterPorId(vendedorId);
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
        });
    }
}
exports.VendasService = VendasService;
//# sourceMappingURL=vendasService.js.map