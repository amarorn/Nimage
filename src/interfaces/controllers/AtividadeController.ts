import { Request, Response } from "express";
import { CriarAtividade } from "../../application/use-cases/CriarAtividade";
import { ObterAtividades } from "../../application/use-cases/ObterAtividades";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { AtualizarAtividade } from "../../application/use-cases/AtualizarAtividade";

export class AtividadeController {
    constructor(
        private criarAtividade: CriarAtividade,
        private obterAtividades: ObterAtividades,
        private atualizarAtividade: AtualizarAtividade
    ) {}

    async criar(req: Request, res: Response) {
        try {
            // //console.log("📥 Dados recebidos no body:", req.body);
            
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

            // //console.log("✨ Dados extraídos:", { id, vendedorId, data, docinhosCoco });

            const atividade = await this.criarAtividade.executar({ 
                id, 
                vendedorId, 
                data: new Date(data), 
                docinhosCoco 
            });
            
            // //console.log("✅ Atividade criada com sucesso:", atividade);
            return res.status(201).json(atividade);
        } catch (erro) {
            // console.error("❌ Erro ao criar atividade:", erro);
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
            // //console.log("✅ Atividades obtidas com sucesso:", atividades);

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
            // console.error("❌ Erro ao obter atividades:", erro);
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
            // //console.log("✅ Atividade obtida com sucesso:", atividade);

            if (!atividade) {
                return res.status(404).json({ erro: 'Atividade não encontrada' });
            }

            return res.status(200).json(atividade);
        } catch (erro) {
            // console.error("❌ Erro ao obter atividade:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter atividade',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterDetalhes(req: Request, res: Response) {
        try {
            const { id } = req.params;
            // //console.log("🔍 Buscando detalhes para atividade ID:", id);

            const atividade = await this.obterAtividades.executarPorId(id);
            if (!atividade) {
                // //console.log("⚠️ Atividade não encontrada");
                return res.status(404).json({ erro: 'Atividade não encontrada' });
            }

            const vendedorRepo = new VendedorRepositoryImpl();
            const vendedor = await vendedorRepo.obterPorId(atividade.vendedorId);
            if (!vendedor) {
                // //console.log("⚠️ Vendedor não encontrado");
                return res.status(404).json({ erro: 'Vendedor não encontrado' });
            }

            const equipeRepo = new EquipeRepositoryImpl();
            const equipe = await equipeRepo.obterPorId(vendedor.equipe_id);
            if (!equipe) {
                // //console.log("⚠️ Equipe não encontrada");
                return res.status(404).json({ erro: 'Equipe não encontrada' });
            }

            const metaRepo = new MetaRepositoryImpl();
            const metas = await metaRepo.obterPorEquipe(equipe.id);

            // //console.log("✅ Detalhes obtidos com sucesso:", { atividade, vendedor, equipe, metas });

            return res.status(200).json({
                atividade: {
                    id: atividade.id,
                    vendedorId: atividade.vendedorId,
                    data: atividade.data,
                    docinhosCoco: atividade.docinhosCoco
                },
                vendedor: {
                    id: vendedor.id,
                    nome: vendedor.nome,
                    equipe_id: vendedor.equipe_id
                },
                equipe: {
                    id: equipe.id,
                    nome: equipe.nome
                },
                metas: metas ? {
                    id: metas.id,
                    equipeId: metas.equipeId,
                    objetivo: metas.objetivo
                } : null
            });
        } catch (erro) {
            // console.error("❌ Erro ao obter detalhes da atividade:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter detalhes da atividade',
                mensagem: (erro as Error).message 
            });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            // //console.log("📥 Dados recebidos para atualização:", req.body);
            const { id } = req.params;
            const { vendedorId, data, docinhosCoco } = req.body;

            // Validação dos campos obrigatórios
            if (!vendedorId || !data || docinhosCoco === undefined) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        vendedorId: vendedorId ? 'presente' : 'ausente',
                        data: data ? 'presente' : 'ausente',
                        docinhosCoco: docinhosCoco !== undefined ? 'presente' : 'ausente'
                    }
                });
            }

            const atividadeAtualizada = await this.atualizarAtividade.executar(id, { vendedorId, data: new Date(data), docinhosCoco });
            // //console.log("✅ Atividade atualizada com sucesso:", atividadeAtualizada);

            return res.status(200).json(atividadeAtualizada);
        } catch (erro) {
            // console.error("❌ Erro ao atualizar atividade:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao atualizar atividade',
                mensagem: (erro as Error).message 
            });
        }
    }
}