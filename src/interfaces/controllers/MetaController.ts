import { Request, Response } from "express";
import { CriarMeta } from "../../application/use-cases/CriarMeta";
import { ObterMeta } from "../../application/use-cases/ObterMeta";

export class MetaController {
    constructor(private criarMeta: CriarMeta, private obterMeta: ObterMeta) {}

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
}