import { Request, Response } from "express";
import { CriarMeta } from "../../application/use-cases/CriarMeta";
import { ObterMeta } from "../../application/use-cases/ObterMeta";
import { AtualizarMeta } from "../../application/use-cases/AtualizarMeta";

export class MetaController {
    constructor(private criarMeta: CriarMeta, private obterMeta: ObterMeta, private atualizarMeta: AtualizarMeta) {}

    async criar(req: Request, res: Response) {
        try {
            console.log("📥 Dados recebidos no body:", req.body);
            
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }

            const { id, equipeId, objetivo } = req.body;

            // Validação dos campos obrigatórios
            if (!id || !equipeId || objetivo === undefined) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        equipeId: equipeId ? 'presente' : 'ausente',
                        objetivo: objetivo !== undefined ? 'presente' : 'ausente'
                    }
                });
            }

            console.log("✨ Dados extraídos:", { id, equipeId, objetivo });

            const meta = await this.criarMeta.executar({ id, equipeId, objetivo });
            console.log("✅ Meta criada com sucesso:", meta);
            
            return res.status(201).json(meta);
        } catch (erro) {
            console.error("❌ Erro ao criar meta:", erro);
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
            console.log("✅ Metas obtidas com sucesso:", metas);

            // Criar uma resposta personalizada com paginação
            const respostaPersonalizada = {
                pagina: page,
                limite: limit,
                total: metas.length,
                metas: metas.map(meta => ({
                    id: meta.id,
                    equipeId: meta.equipeId,
                    objetivo: meta.objetivo
                }))
            };

            return respostaPersonalizada;
        } catch (erro) {
            console.error("❌ Erro ao obter metas:", erro);
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
            console.log("✅ Meta obtida com sucesso:", meta);

            if (!meta) {
                return res.status(404).json({ erro: 'Meta não encontrada' });
            }

            return res.status(200).json(meta);
        } catch (erro) {
            console.error("❌ Erro ao obter meta:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter meta',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterPorEquipe(req: Request, res: Response) {
        try {
            console.log("🔍 Recebendo requisição para obter meta por equipe", req.params);
            const { equipeId } = req.params;
            console.log("🔍 Buscando meta para equipe ID:", equipeId);
            
            const meta = await this.obterMeta.executarPorEquipe(equipeId);
            console.log("✅ Meta obtida por equipe com sucesso:", meta);

            if (!meta) {
                console.log("⚠️ Nenhuma meta encontrada para a equipe");
                return res.status(404).json({ erro: 'Meta não encontrada para esta equipe' });
            }

            console.log("📤 Retornando meta:", meta);
            return res.status(200).json({
                status: 'success',
                data: {
                    id: meta.id,
                    equipeId: meta.equipeId,
                    objetivo: meta.objetivo
                }
            });
        } catch (erro) {
            console.error("❌ Erro ao obter meta por equipe:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter meta por equipe',
                mensagem: (erro as Error).message 
            });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            console.log("📥 Dados recebidos para atualização:", req.body);
            const { id } = req.params;
            const { equipeId, objetivo } = req.body;

            // Validação dos campos obrigatórios
            if (!equipeId || objetivo === undefined) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        equipeId: equipeId ? 'presente' : 'ausente',
                        objetivo: objetivo !== undefined ? 'presente' : 'ausente'
                    }
                });
            }

            const metaAtualizada = await this.atualizarMeta.executar(id, { equipeId, objetivo });
            console.log("✅ Meta atualizada com sucesso:", metaAtualizada);

            return res.status(200).json(metaAtualizada);
        } catch (erro) {
            console.error("❌ Erro ao atualizar meta:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao atualizar meta',
                mensagem: (erro as Error).message 
            });
        }
    }
}