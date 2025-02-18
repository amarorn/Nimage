import { Request, Response } from "express";
import { CriarAtividade } from "../../application/use-cases/CriarAtividade";
import { ObterAtividades } from "../../application/use-cases/ObterAtividades";

export class AtividadeController {
    constructor(private criarAtividade: CriarAtividade, private obterAtividades: ObterAtividades) {}

    async criar(req: Request, res: Response) {
        try {
            console.log("📥 Dados recebidos no body:", req.body);
            
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }

            const { id, vendedorId, data, docinhosCoco } = req.body;

            // Validação dos campos obrigatórios
            if (!id || !vendedorId || !data || docinhosCoco === undefined) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        vendedorId: vendedorId ? 'presente' : 'ausente',
                        data: data ? 'presente' : 'ausente',
                        docinhosCoco: docinhosCoco !== undefined ? 'presente' : 'ausente'
                    }
                });
            }

            console.log("✨ Dados extraídos:", { id, vendedorId, data, docinhosCoco });

            const atividade = await this.criarAtividade.executar({ 
                id, 
                vendedorId, 
                data: new Date(data), 
                docinhosCoco 
            });
            
            console.log("✅ Atividade criada com sucesso:", atividade);
            return res.status(201).json(atividade);
        } catch (erro) {
            console.error("❌ Erro ao criar atividade:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao criar atividade',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterTodos(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const atividades = await this.obterAtividades.executar(skip, limit);
            console.log("✅ Atividades obtidas com sucesso:", atividades);

            // Criar uma resposta personalizada com paginação
            const respostaPersonalizada = {
                pagina: page,
                limite: limit,
                total: atividades.length,
                atividades: atividades.map(atividade => ({
                    id: atividade.id,
                    vendedorId: atividade.vendedorId,
                    data: atividade.data,
                    docinhosCoco: atividade.docinhosCoco
                }))
            };

            return respostaPersonalizada;
        } catch (erro) {
            console.error("❌ Erro ao obter atividades:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter atividades',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const atividade = await this.obterAtividades.executarPorId(id);
            console.log("✅ Atividade obtida com sucesso:", atividade);

            if (!atividade) {
                return res.status(404).json({ erro: 'Atividade não encontrada' });
            }

            return res.status(200).json(atividade);
        } catch (erro) {
            console.error("❌ Erro ao obter atividade:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter atividade',
                mensagem: (erro as Error).message 
            });
        }
    }
}