import { Request, Response } from "express";
import { CriarMeta } from "../../application/use-cases/CriarMeta";
import { ObterMeta } from "../../application/use-cases/ObterMeta";
import { AtualizarMeta } from "../../application/use-cases/AtualizarMeta";

export class MetaController {
    constructor(private criarMeta: CriarMeta, private obterMeta: ObterMeta, private atualizarMeta: AtualizarMeta) {}

    async criar(req: Request, res: Response) {
        try {
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }

            const { id, equipeId, objetivo, mes } = req.body;

            // Validação dos campos obrigatórios
            if (!id || !equipeId || objetivo === undefined || !mes) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        equipeId: equipeId ? 'presente' : 'ausente',
                        objetivo: objetivo !== undefined ? 'presente' : 'ausente',
                        mes: mes ? 'presente' : 'ausente'
                    }
                });
            }

            // Validação do mês
            const mesNum = parseInt(mes);
            if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
                return res.status(400).json({
                    erro: 'Mês inválido',
                    detalhes: { mes: mesNum }
                });
            }

            // Pega o ano atual
            const anoAtual = new Date().getFullYear();

            // Cria a data com o primeiro dia do mês
            const data = new Date(anoAtual, mesNum - 1, 1);

            const meta = await this.criarMeta.executar({
                id,
                equipeId,
                objetivo,
                data
            });
            
            return res.status(201).json(meta);
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao criar meta',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterTodos(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const metas = await this.obterMeta.executar(skip, limit);

            const respostaPersonalizada = {
                pagina: page,
                statuscode: 200,
                limite: limit,
                total: metas.length,
                metas: metas.map(meta => ({
                    id: meta.id,
                    equipeId: meta.equipeId,
                    objetivo: meta.objetivo,
                    data: meta.data,
                    mes: meta.data.getMonth() + 1,
                    ano: meta.data.getFullYear()
                }))
            };

            return respostaPersonalizada;
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao obter metas',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const meta = await this.obterMeta.executarPorId(id);

            if (!meta) {
                return res.status(404).json({ erro: 'Meta não encontrada' });
            }

            return res.status(200).json({
                id: meta.id,
                equipeId: meta.equipeId,
                objetivo: meta.objetivo,
                data: meta.data
            });
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao obter meta',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterPorEquipe(req: Request, res: Response) {
        try {
            const { equipeId } = req.params;
            
            const meta = await this.obterMeta.executarPorEquipe(equipeId);

            if (!meta) {
                return res.status(404).json({ erro: 'Meta não encontrada para esta equipe' });
            }

            return res.status(200).json({
                status: 'success',
                data: {
                    id: meta.id,
                    equipeId: meta.equipeId,
                    objetivo: meta.objetivo,
                    data: meta.data
                }
            });
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao obter meta por equipe',
                mensagem: (erro as Error).message 
            });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { equipeId, objetivo, mes } = req.body;

            if (!equipeId || objetivo === undefined || !mes) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        equipeId: equipeId ? 'presente' : 'ausente',
                        objetivo: objetivo !== undefined ? 'presente' : 'ausente',
                        mes: mes ? 'presente' : 'ausente'
                    }
                });
            }

            // Validação do mês
            const mesNum = parseInt(mes);
            if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
                return res.status(400).json({
                    erro: 'Mês inválido',
                    detalhes: { mes: mesNum }
                });
            }

            // Pega o ano atual
            const anoAtual = new Date().getFullYear();
            const data = new Date(anoAtual, mesNum - 1, 1);

            const metaAtualizada = await this.atualizarMeta.executar(id, { 
                equipeId, 
                objetivo,
                data
            });

            return res.status(200).json(metaAtualizada);
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao atualizar meta',
                mensagem: (erro as Error).message 
            });
        }
    }
}