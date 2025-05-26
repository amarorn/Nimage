import { Request, Response } from 'express';
import { ObterRelatorio } from '../../application/use-cases/ObterRelatorio';

export class RelatorioController {
    constructor(private obterRelatorio: ObterRelatorio) {}

    async atividadesPorMontadora(req: Request, res: Response) {
        try {
            const resultado = await this.obterRelatorio.atividadesPorMontadora();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório por montadora' });
        }
    }

    async atividadesPorVendedor(req: Request, res: Response) {
        try {
            const resultado = await this.obterRelatorio.atividadesPorVendedor();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório por vendedor' });
        }
    }

    async atividadesPorLoja(req: Request, res: Response) {
        try {
            const resultado = await this.obterRelatorio.atividadesPorLoja();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório por loja' });
        }
    }

    async atividadesPorEquipe(req: Request, res: Response) {
        try {
            const resultado = await this.obterRelatorio.atividadesPorEquipe();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório por equipe' });
        }
    }

    async relatorioDocinhosCoco(req: Request, res: Response) {
        try {
            const resultado = await this.obterRelatorio.relatorioDocinhosCoco();
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao gerar relatório de docinhos de coco' });
        }
    }
} 