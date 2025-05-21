import { Request, Response } from "express";
import { CriarTema } from "../../application/use-cases/CriarTema";
import { ObterTema } from "../../application/use-cases/ObterTema";
import { AtualizarTema } from "../../application/use-cases/AtualizarTema";
import { TemaRepository } from "../../domain/repositories/TemaRepository";

export class TemaController {
    constructor(
        private criarTema: CriarTema,
        private obterTema: ObterTema,
        private atualizarTema: AtualizarTema,
        private temaRepo: TemaRepository
    ) {}

    async criar(req: Request, res: Response) {
        try {
            const { nome, descricao, cor } = req.body;

            if (!nome || !descricao || !cor) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        nome: nome ? 'presente' : 'ausente',
                        descricao: descricao ? 'presente' : 'ausente',
                        cor: cor ? 'presente' : 'ausente'
                    }
                });
            }

            const tema = await this.criarTema.executar({ nome, descricao, cor });
            return res.status(201).json(tema);
        } catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao criar tema',
                mensagem: (erro as Error).message
            });
        }
    }

    async obterTodos(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const { temas, total } = await this.obterTema.executar(skip, limit);

            return res.status(200).json({
                pagina: page,
                limite: limit,
                total,
                totalPaginas: Math.ceil(total / limit),
                temas
            });
        } catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter temas',
                mensagem: (erro as Error).message
            });
        }
    }

    async obterPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const tema = await this.obterTema.executarPorId(id);

            if (!tema) {
                return res.status(404).json({ erro: 'Tema não encontrado' });
            }

            return res.status(200).json(tema);
        } catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter tema',
                mensagem: (erro as Error).message
            });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, descricao, cor } = req.body;

            if (!nome || !descricao || !cor) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        nome: nome ? 'presente' : 'ausente',
                        descricao: descricao ? 'presente' : 'ausente',
                        cor: cor ? 'presente' : 'ausente'
                    }
                });
            }

            const temaAtualizado = await this.atualizarTema.executar(id, { nome, descricao, cor });

            if (!temaAtualizado) {
                return res.status(404).json({ erro: 'Tema não encontrado' });
            }

            return res.status(200).json(temaAtualizado);
        } catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao atualizar tema',
                mensagem: (erro as Error).message
            });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.temaRepo.deletar(id);
            return res.status(204).send();
        } catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao deletar tema',
                mensagem: (erro as Error).message
            });
        }
    }
} 