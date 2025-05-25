"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioController = void 0;
class RelatorioController {
    constructor(relatorioService) {
        this.relatorioService = relatorioService;
    }
    async atividadesPorMontadora(req, res) {
        try {
            const resultado = await this.relatorioService.atividadesPorMontadora();
            res.json(resultado);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório por montadora' });
        }
    }
    async atividadesPorVendedor(req, res) {
        try {
            const resultado = await this.relatorioService.atividadesPorVendedor();
            res.json(resultado);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório por vendedor' });
        }
    }
    async atividadesPorLoja(req, res) {
        try {
            const resultado = await this.relatorioService.atividadesPorLoja();
            res.json(resultado);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório por loja' });
        }
    }
    async atividadesPorEquipe(req, res) {
        try {
            const resultado = await this.relatorioService.atividadesPorEquipe();
            res.json(resultado);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório por equipe' });
        }
    }
}
exports.RelatorioController = RelatorioController;
//# sourceMappingURL=RelatorioController.js.map