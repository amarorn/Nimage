import { Request, Response } from "express";
import { CriarAtividade } from "../../application/use-cases/CriarAtividade";
import { ObterAtividades } from "../../application/use-cases/ObterAtividades";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { AtualizarAtividade } from "../../application/use-cases/AtualizarAtividade";
import { AtividadeService } from "../../application/services/AtividadeService";
import { ObterAtividadesPorVendedorEData } from "../../application/use-cases/ObterAtividadesPorVendedorEData";
import { AtividadesPorVendedorResult } from "../../application/services/AtividadeService";
import { FrequenciaVendasService } from "../../application/services/FrequenciaVendasService";
import { AtividadeCacheService } from "../../infrastructure/cache/AtividadeCacheService";
import { Atividade } from "../../domain/entities/Atividade";

export class AtividadeController {
    private atividadeCache: AtividadeCacheService;

    constructor(
        private criarAtividade: CriarAtividade,
        private obterAtividades: ObterAtividades,
        private atualizarAtividade: AtualizarAtividade,
        private atividadeService: AtividadeService,
        private obterAtividadesPorVendedorEData: ObterAtividadesPorVendedorEData,
        private frequenciaVendasService: FrequenciaVendasService
    ) {
        this.atividadeCache = AtividadeCacheService.getInstance();
    }

    async criar(req: Request, res: Response) {
        try {
            // //console.log("📥 Dados recebidos no body:", req.body);
            
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }

            const { id, vendedorId, data, docinhosCoco, follow_up, clienteId } = req.body;

            // Validação dos campos obrigatórios
            if (!id || !vendedorId || !data || docinhosCoco === undefined || follow_up === undefined || !clienteId) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        vendedorId: vendedorId ? 'presente' : 'ausente',
                        data: data ? 'presente' : 'ausente',
                        docinhosCoco: docinhosCoco !== undefined ? 'presente' : 'ausente',
                        follow_up: follow_up !== undefined ? 'presente' : 'ausente',
                        clienteId: clienteId ? 'presente' : 'ausente'
                    }
                });
            }

            // //console.log("✨ Dados extraídos:", { id, vendedorId, data, docinhosCoco });

            const atividade = await this.criarAtividade.executar({ 
                id, 
                vendedorId, 
                data: new Date(data), 
                docinhosCoco,
                follow_up,
                clienteId
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

            // Usa cache paginado
            const cachedResult = await this.atividadeCache.getAtividadesPaginadas(skip, limit);

            if (cachedResult) {
                console.log('📦 Cache hit: Atividades encontradas no cache');
                return res.status(200).json({
                    pagina: page,
                    limite: limit,
                    total: cachedResult.total,
                    totalPaginas: Math.ceil(cachedResult.total / limit),
                    atividades: cachedResult.atividades.map((atividade: Atividade) => ({
                        id: atividade.id,
                        vendedorId: atividade.vendedorId,
                        data: atividade.data,
                        docinhosCoco: atividade.docinhosCoco,
                        follow_up: atividade.follow_up,
                        clienteId: atividade.clienteId
                    }))
                });
            }

            console.log('🔄 Cache miss: Buscando atividades do banco');
            const { atividades, total } = await this.obterAtividades.executar(skip, limit);

            // Salva no cache paginado
            await this.atividadeCache.setAtividadesPaginadas(skip, limit, { atividades, total });
            console.log('💾 Cache: Atividades salvas no cache');

            return res.status(200).json({
                pagina: page,
                limite: limit,
                total,
                totalPaginas: Math.ceil(total / limit),
                atividades: atividades.map((atividade: Atividade) => ({
                    id: atividade.id,
                    vendedorId: atividade.vendedorId,
                    data: atividade.data,
                    docinhosCoco: atividade.docinhosCoco,
                    follow_up: atividade.follow_up,
                    clienteId: atividade.clienteId
                }))
            });
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
            const equipe = await equipeRepo.obterPorId(vendedor.equipeId);
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
                    equipeId: vendedor.equipeId
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
            const { vendedorId, data, docinhosCoco, follow_up, clienteId } = req.body;

            // Validação dos campos obrigatórios
            if (!vendedorId || !data || docinhosCoco === undefined || follow_up === undefined || !clienteId) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        vendedorId: vendedorId ? 'presente' : 'ausente',
                        data: data ? 'presente' : 'ausente',
                        docinhosCoco: docinhosCoco !== undefined ? 'presente' : 'ausente',
                        follow_up: follow_up !== undefined ? 'presente' : 'ausente',
                        clienteId: clienteId ? 'presente' : 'ausente'
                    }
                });
            }

            const atividadeAtualizada = await this.atualizarAtividade.executar(id, { 
                vendedorId, 
                data: new Date(data), 
                docinhosCoco,
                follow_up,
                clienteId
            });
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

    async getAtividadesByVendedorAndDate(req: Request, res: Response) {
        try {
            const { vendedorId } = req.params;
            
            // Usa o primeiro dia do mês atual como data inicial e o último dia como data final
            const hoje = new Date();
            const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

            console.log('Debug - Datas calculadas:', {
                dataInicio,
                dataFim
            });

            const resultado = await this.obterAtividadesPorVendedorEData.executar(
                vendedorId, 
                dataInicio, 
                dataFim
            );

            console.log('Debug - Resultado obtido:', resultado);

            // Calcula o progresso em relação à meta
            let progresso = null;
            if (resultado.meta && resultado.meta.objetivo > 0) {
                progresso = (resultado.valorTotal / resultado.meta.objetivo) * 100;
            }

            return res.status(200).json({
                ...resultado,
                progresso: progresso ? `${progresso.toFixed(2)}%` : null
            });
        } catch (erro) {
            console.error('Debug - Erro:', erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter atividades',
                mensagem: (erro as Error).message 
            });
        }
    }

    async calcularFrequenciaVendas(req: Request, res: Response) {
        try {
            const { equipeId } = req.params;
            const { dataInicio, dataFim } = req.query;

            if (!dataInicio || !dataFim) {
                return res.status(400).json({
                    erro: 'Datas não fornecidas',
                    detalhes: { dataInicio, dataFim }
                });
            }

            const dataInicioObj = new Date(dataInicio as string);
            const dataFimObj = new Date(dataFim as string);

            const resultado = await this.frequenciaVendasService.calcularFrequencia(equipeId, dataInicioObj, dataFimObj);
            const fea = await this.atividadeService.calcularFEA(equipeId, resultado.totalDiasDisponiveis, resultado.diasComAtividade);

            return res.status(200).json({
                resultado
            });
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao calcular frequência de vendas',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterTodosCompleto(req: Request, res: Response) {
        try {
            // Busca todas as atividades sem paginação (limite alto) diretamente do banco
            const atividades = await (this.obterAtividades as any).atividadeRepo.obterTodos(0, 99999);
            const total = atividades.length;
            return res.status(200).json({
                atividades: atividades.map((atividade: Atividade) => ({
                    id: atividade.id,
                    vendedorId: atividade.vendedorId,
                    data: atividade.data,
                    docinhosCoco: atividade.docinhosCoco,
                    follow_up: atividade.follow_up,
                    clienteId: atividade.clienteId
                })),
                total
            });
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao obter atividades (completo)',
                mensagem: (erro as Error).message 
            });
        }
    }
}