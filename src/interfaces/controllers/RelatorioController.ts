import { Request, Response } from 'express';
import { RelatorioService } from '../../application/services/RelatorioService';

export class RelatorioController {
    constructor(private relatorioService: RelatorioService) {}

    async atividadesPorMontadora(req: Request, res: Response) {
        try {
            const resultado = await this.relatorioService.atividadesPorMontadora();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório por montadora' });
        }
    }

    async atividadesPorVendedor(req: Request, res: Response) {
        try {
            const resultado = await this.relatorioService.atividadesPorVendedor();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório por vendedor' });
        }
    }

    async atividadesPorLoja(req: Request, res: Response) {
        try {
            const resultado = await this.relatorioService.atividadesPorLoja();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório por loja' });
        }
    }

    async atividadesPorEquipe(req: Request, res: Response) {
        try {
            const resultado = await this.relatorioService.atividadesPorEquipe();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório por equipe' });
        }
    }
} 