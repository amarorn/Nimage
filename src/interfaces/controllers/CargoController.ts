import { Request, Response } from "express";
import { CriarCargo } from "../../application/use-cases/CriarCargo";
import { ObterCargo } from "../../application/use-cases/ObterCargo";
import { AtualizarCargo } from "../../application/use-cases/AtualizarCargo";
import { CargoRepository } from "../../domain/repositories/CargoRepository";

export class CargoController {
    constructor(
        private criarCargo: CriarCargo,
        private obterCargo: ObterCargo,
        private atualizarCargo: AtualizarCargo,
        private cargoRepo: CargoRepository
    ) {}

    async criar(req: Request, res: Response) {
        try {
            const { id, nome, descricao, tag } = req.body;

            if (!id || !nome || !descricao || !tag) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        nome: nome ? 'presente' : 'ausente',
                        descricao: descricao ? 'presente' : 'ausente',
                        tag: tag ? 'presente' : 'ausente'
                    }
                });
            }

            const cargo = await this.criarCargo.executar({ id, nome, descricao, tag });
            return res.status(201).json(cargo);
        } catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao criar cargo',
                mensagem: (erro as Error).message
            });
        }
    }

    async obterTodos(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const { cargos, total } = await this.obterCargo.executar(skip, limit);

            return res.status(200).json({
                pagina: page,
                limite: limit,
                total,
                totalPaginas: Math.ceil(total / limit),
                cargos
            });
        } catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter cargos',
                mensagem: (erro as Error).message
            });
        }
    }

    async obterPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const cargo = await this.obterCargo.executarPorId(id);

            if (!cargo) {
                return res.status(404).json({ erro: 'Cargo não encontrado' });
            }

            return res.status(200).json(cargo);
        } catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter cargo',
                mensagem: (erro as Error).message
            });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, descricao, tag } = req.body;

            if (!nome || !descricao || !tag) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        nome: nome ? 'presente' : 'ausente',
                        descricao: descricao ? 'presente' : 'ausente',
                        tag: tag ? 'presente' : 'ausente'
                    }
                });
            }

            const cargoAtualizado = await this.atualizarCargo.executar(id, { nome, descricao, tag });

            if (!cargoAtualizado) {
                return res.status(404).json({ erro: 'Cargo não encontrado' });
            }

            return res.status(200).json(cargoAtualizado);
        } catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao atualizar cargo',
                mensagem: (erro as Error).message
            });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.cargoRepo.deletar(id);
            return res.status(204).send();
        } catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao deletar cargo',
                mensagem: (erro as Error).message
            });
        }
    }
} 