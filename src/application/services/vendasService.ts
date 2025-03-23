import { VendedorRepository } from '../../domain/repositories/VendedorRepository';
import { VendasRepository, Venda } from '../../domain/repositories/VendasRepository';

export interface MetricasVendedor {
    fea: number;
    iap: number;
    diasComAtividade: number;
    totalVendas: number;
    mediaPorDia: number;
    metaEquipe: number;
}

export class VendasService {
    constructor(
        private vendedorRepository: VendedorRepository,
        private vendasRepository: VendasRepository
    ) {}

    async obterTodosVendedores() {
        return this.vendedorRepository.obterTodos(0, Number.MAX_SAFE_INTEGER);
    }

    async calcularMetricasVendedor(vendedorId: string) {
        const vendas = await this.vendasRepository.obterPorVendedorId(vendedorId);
        const vendedor = await this.vendedorRepository.obterPorId(vendedorId);

        if (!vendedor) {
            throw new Error('Vendedor não encontrado');
        }

        const totalVendas = vendas.reduce((soma: number, venda: Venda) => soma + venda.valor, 0);
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