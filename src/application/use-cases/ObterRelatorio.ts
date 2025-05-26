import { RelatorioService } from '../services/RelatorioService';

export class ObterRelatorio {
    constructor(private relatorioService: RelatorioService) {}

    async atividadesPorMontadora() {
        return this.relatorioService.atividadesPorMontadora();
    }

    async atividadesPorVendedor() {
        return this.relatorioService.atividadesPorVendedor();
    }

    async atividadesPorLoja() {
        return this.relatorioService.atividadesPorLoja();
    }

    async atividadesPorEquipe() {
        return this.relatorioService.atividadesPorEquipe();
    }

    async relatorioDocinhosCoco() {
        return this.relatorioService.relatorioDocinhosCoco();
    }
} 