import { Request, Response } from 'express';
import { CriarMontadora } from '../../application/use-cases/CriarMontadora';
import { ObterMontadora } from '../../application/use-cases/ObterMontadora';
import { AtualizarMontadora } from '../../application/use-cases/AtualizarMontadora';
import { DeletarMontadora } from '../../application/use-cases/DeletarMontadora';
import { v4 as uuidv4 } from 'uuid';

export class MontadoraController {
    constructor(
        private criarMontadora: CriarMontadora,
        private obterMontadora: ObterMontadora,
        private atualizarMontadora: AtualizarMontadora,
        private deletarMontadora: DeletarMontadora
    ) {}

    async criar(req: Request, res: Response) {
        try {
            const id = uuidv4();
            const { razaoSocial, nomeFantasia, cnpj, telefoneFixo } = req.body;
            if (!razaoSocial || !nomeFantasia || !cnpj || !telefoneFixo) {
                return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
            }
            const montadora = await this.criarMontadora.executar({
                id,
                razaoSocial,
                nomeFantasia,
                cnpj,
                telefoneFixo
            });
            res.status(201).json(montadora);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao criar montadora' });
        }
    }

    async obterTodos(req: Request, res: Response) {
        try {
            const pagina = parseInt(req.query.pagina as string) || 1;
            const limite = parseInt(req.query.limite as string) || 10;
            const skip = (pagina - 1) * limite;
            const montadoras = await this.obterMontadora.executar(skip, limite);
            res.json(montadoras);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter montadoras' });
        }
    }

    async obterTodosCompleto(req: Request, res: Response) {
        try {
            // Usa um limite bem alto para retornar todos os registros
            const montadoras = await this.obterMontadora.executar(0, 9999);
            res.json(montadoras);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter todas as montadoras' });
        }
    }

    async obterPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const montadora = await this.obterMontadora.executarPorId(id);
            if (!montadora) {
                return res.status(404).json({ error: 'Montadora não encontrada' });
            }
            res.json(montadora);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter montadora' });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const dados = req.body;
            const montadoraAtualizada = await this.atualizarMontadora.executar(id, dados);
            if (!montadoraAtualizada) {
                return res.status(404).json({ error: 'Montadora não encontrada' });
            }
            res.json(montadoraAtualizada);
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao atualizar montadora' });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.deletarMontadora.executar(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao deletar montadora' });
        }
    }
} 