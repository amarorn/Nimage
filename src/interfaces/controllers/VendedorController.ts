import { Request, Response } from "express";
import { CriarVendedor } from "../../application/use-cases/CriarVendedor";
import { ObterVendedor } from "../../application/use-cases/ObterVendedor";
import { AtualizarVendedor } from "../../application/use-cases/AtualizarVendedor";
import { GetVendedorInsights } from "../../application/use-cases/GetVendedorInsights";

export class VendedorController {
    constructor(
        private criarVendedor: CriarVendedor,
        private obterVendedor: ObterVendedor,
        private atualizarVendedor: AtualizarVendedor,
        private getVendedorInsights: GetVendedorInsights
    ) {}

    async criar(req: Request, res: Response) {
        try {
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }

            const { id, nome, equipeId, email, telefone, meta, cargo } = req.body;

            // Validação dos campos obrigatórios
            if (!id || !nome || !equipeId || !email || !telefone || !meta || !cargo) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        nome: nome ? 'presente' : 'ausente',
                        equipeId: equipeId ? 'presente' : 'ausente',
                        email: email ? 'presente' : 'ausente',
                        telefone: telefone ? 'presente' : 'ausente',
                        meta: meta ? 'presente' : 'ausente',
                        cargo: cargo ? 'presente' : 'ausente'
                    }
                });
            }

            const vendedor = await this.criarVendedor.executar({ id, nome, equipeId, email, telefone, meta, cargo });
            return res.status(201).json(vendedor);
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao criar vendedor',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterTodos(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const vendedores = await this.obterVendedor.executar(skip, limit);

            const respostaPersonalizada = {
                pagina: page,
                limite: limit,
                total: vendedores.length,
                vendedores: vendedores.map(vendedor => ({
                    id: vendedor.id,
                    nome: vendedor.nome,
                    equipeId: vendedor.equipeId,
                    email: vendedor.email,
                    telefone: vendedor.telefone,
                    meta: vendedor.meta,
                    cargo: vendedor.cargo
                }))
            };

            return respostaPersonalizada;
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao obter vendedores',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vendedor = await this.obterVendedor.executarPorId(id);

            if (!vendedor) {
                return res.status(404).json({ erro: 'Vendedor não encontrado' });
            }

            return res.status(200).json({
                id: vendedor.id,
                nome: vendedor.nome,
                equipeId: vendedor.equipeId,
                email: vendedor.email,
                telefone: vendedor.telefone,
                meta: vendedor.meta,
                cargo: vendedor.cargo
            });
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao obter vendedor',
                mensagem: (erro as Error).message 
            });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, equipeId, email, telefone, meta, cargo } = req.body;

            // Validação dos campos obrigatórios
            const camposAtualizacao = { nome, equipeId, email, telefone, meta, cargo };
            const camposVazios = Object.entries(camposAtualizacao)
                .filter(([_, valor]) => valor !== undefined && !valor)
                .map(([campo]) => campo);

            if (camposVazios.length > 0) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: `Os seguintes campos estão vazios: ${camposVazios.join(', ')}`
                });
            }

            const vendedorAtualizado = await this.atualizarVendedor.executar(id, camposAtualizacao);
            return res.status(200).json(vendedorAtualizado);
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao atualizar vendedor',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterInsights(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { mes } = req.query;
            console.log("🚀 ~ VendedorController ~ obterInsights ~ mes:", mes)
            const insights = await this.getVendedorInsights.execute(id, mes as string);
            return res.json(insights);
        } catch (error) {
            console.error('Erro ao obter insights do vendedor:', error);
            return res.status(400).json({ error: 'Erro ao obter insights do vendedor' });
        }
    }
}