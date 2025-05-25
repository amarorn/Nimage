import { Request, Response } from 'express';
import { CriarLoja } from '../../application/use-cases/CriarLoja';
import { AtualizarLoja } from '../../application/use-cases/AtualizarLoja';
import { ObterLoja } from '../../application/use-cases/ObterLoja';
import { DeletarLoja } from '../../application/use-cases/DeletarLoja';
import { v4 as uuidv4 } from 'uuid';

export class LojaController {
    constructor(
        private criarLoja: CriarLoja,
        private atualizarLoja: AtualizarLoja,
        private obterLoja: ObterLoja,
        private deletarLoja: DeletarLoja
    ) {}

    async criar(req: Request, res: Response) {
        try {
            const id = uuidv4();
            const { nome, cnpj, telefone, montadoraId } = req.body;
            if (!nome || !cnpj || !telefone || !montadoraId) {
                return res.status(400).json({ error: 'Campos obrigatórios ausentes', detalhes: { nome, cnpj, telefone, montadoraId } });
            }
            const loja = await this.criarLoja.executar({ id, nome, cnpj, telefone, montadoraId });
            res.status(201).json(loja);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao criar loja' });
        }
    }

    async obterTodos(req: Request, res: Response) {
        try {
            const pagina = parseInt(req.query.pagina as string) || 1;
            const limite = parseInt(req.query.limite as string) || 10;
            const skip = (pagina - 1) * limite;
            const resultado = await this.obterLoja.executar(skip, limite);
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter lojas' });
        }
    }

    async obterTodosCompleto(req: Request, res: Response) {
        try {
            // Usa um limite bem alto para retornar todos os registros
            const resultado = await this.obterLoja.executar(0, 9999);
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter todas as lojas' });
        }
    }

    async obterPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const loja = await this.obterLoja.executarPorId(id);
            if (!loja) {
                return res.status(404).json({ error: 'Loja não encontrada' });
            }
            res.json(loja);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter loja' });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const loja = await this.atualizarLoja.executar(id, req.body);
            res.json(loja);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao atualizar loja' });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.deletarLoja.executar(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao deletar loja' });
        }
    }
} 