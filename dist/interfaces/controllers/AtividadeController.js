"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtividadeController = void 0;
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const AtividadeCacheService_1 = require("../../infrastructure/cache/AtividadeCacheService");
class AtividadeController {
    constructor(criarAtividade, obterAtividades, atualizarAtividade, atividadeService, obterAtividadesPorVendedorEData, frequenciaVendasService) {
        this.criarAtividade = criarAtividade;
        this.obterAtividades = obterAtividades;
        this.atualizarAtividade = atualizarAtividade;
        this.atividadeService = atividadeService;
        this.obterAtividadesPorVendedorEData = obterAtividadesPorVendedorEData;
        this.frequenciaVendasService = frequenciaVendasService;
        this.atividadeCache = AtividadeCacheService_1.AtividadeCacheService.getInstance();
    }
    async criar(req, res) {
        try {
            // //console.log("📥 Dados recebidos no body:", req.body);
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }
            const { id, vendedorId, data, docinhosCoco, follow_up } = req.body;
            // Validação dos campos obrigatórios
            if (!id || !vendedorId || !data || docinhosCoco === undefined || follow_up === undefined) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        vendedorId: vendedorId ? 'presente' : 'ausente',
                        data: data ? 'presente' : 'ausente',
                        docinhosCoco: docinhosCoco !== undefined ? 'presente' : 'ausente',
                        follow_up: follow_up !== undefined ? 'presente' : 'ausente'
                    }
                });
            }
            // //console.log("✨ Dados extraídos:", { id, vendedorId, data, docinhosCoco });
            const atividade = await this.criarAtividade.executar({
                id,
                vendedorId,
                data: new Date(data),
                docinhosCoco,
                follow_up
            });
            // //console.log("✅ Atividade criada com sucesso:", atividade);
            return res.status(201).json(atividade);
        }
        catch (erro) {
            // console.error("❌ Erro ao criar atividade:", erro);
            return res.status(500).json({
                erro: 'Erro interno ao criar atividade',
                mensagem: erro.message
            });
        }
    }
    async obterTodos(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            // Tenta obter do cache primeiro
            const cacheKey = `list:${page}:${limit}`;
            const cachedAtividades = await this.atividadeCache.getAtividades();
            if (cachedAtividades) {
                console.log('📦 Cache hit: Atividades encontradas no cache');
                return res.status(200).json({
                    pagina: page,
                    limite: limit,
                    total: cachedAtividades.length,
                    atividades: cachedAtividades.map((atividade) => ({
                        id: atividade.id,
                        vendedorId: atividade.vendedorId,
                        data: atividade.data,
                        docinhosCoco: atividade.docinhosCoco
                    }))
                });
            }
            console.log('🔄 Cache miss: Buscando atividades do banco');
            const { atividades, total } = await this.obterAtividades.executar(skip, limit);
            // Salva no cache
            await this.atividadeCache.setAtividades(atividades);
            console.log('💾 Cache: Atividades salvas no cache');
            return res.status(200).json({
                pagina: page,
                limite: limit,
                total,
                totalPaginas: Math.ceil(total / limit),
                atividades: atividades.map((atividade) => ({
                    id: atividade.id,
                    vendedorId: atividade.vendedorId,
                    data: atividade.data,
                    docinhosCoco: atividade.docinhosCoco
                }))
            });
        }
        catch (erro) {
            // console.error("❌ Erro ao obter atividades:", erro);
            return res.status(500).json({
                erro: 'Erro interno ao obter atividades',
                mensagem: erro.message
            });
        }
    }
    async obterPorId(req, res) {
        try {
            const { id } = req.params;
            const atividade = await this.obterAtividades.executarPorId(id);
            // //console.log("✅ Atividade obtida com sucesso:", atividade);
            if (!atividade) {
                return res.status(404).json({ erro: 'Atividade não encontrada' });
            }
            return res.status(200).json(atividade);
        }
        catch (erro) {
            // console.error("❌ Erro ao obter atividade:", erro);
            return res.status(500).json({
                erro: 'Erro interno ao obter atividade',
                mensagem: erro.message
            });
        }
    }
    async obterDetalhes(req, res) {
        try {
            const { id } = req.params;
            // //console.log("🔍 Buscando detalhes para atividade ID:", id);
            const atividade = await this.obterAtividades.executarPorId(id);
            if (!atividade) {
                // //console.log("⚠️ Atividade não encontrada");
                return res.status(404).json({ erro: 'Atividade não encontrada' });
            }
            const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
            const vendedor = await vendedorRepo.obterPorId(atividade.vendedorId);
            if (!vendedor) {
                // //console.log("⚠️ Vendedor não encontrado");
                return res.status(404).json({ erro: 'Vendedor não encontrado' });
            }
            const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
            const equipe = await equipeRepo.obterPorId(vendedor.equipeId);
            if (!equipe) {
                // //console.log("⚠️ Equipe não encontrada");
                return res.status(404).json({ erro: 'Equipe não encontrada' });
            }
            const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
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
        }
        catch (erro) {
            // console.error("❌ Erro ao obter detalhes da atividade:", erro);
            return res.status(500).json({
                erro: 'Erro interno ao obter detalhes da atividade',
                mensagem: erro.message
            });
        }
    }
    async atualizar(req, res) {
        try {
            // //console.log("📥 Dados recebidos para atualização:", req.body);
            const { id } = req.params;
            const { vendedorId, data, docinhosCoco, follow_up } = req.body;
            // Validação dos campos obrigatórios
            if (!vendedorId || !data || docinhosCoco === undefined || follow_up === undefined) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        vendedorId: vendedorId ? 'presente' : 'ausente',
                        data: data ? 'presente' : 'ausente',
                        docinhosCoco: docinhosCoco !== undefined ? 'presente' : 'ausente',
                        follow_up: follow_up !== undefined ? 'presente' : 'ausente'
                    }
                });
            }
            const atividadeAtualizada = await this.atualizarAtividade.executar(id, {
                vendedorId,
                data: new Date(data),
                docinhosCoco,
                follow_up
            });
            // //console.log("✅ Atividade atualizada com sucesso:", atividadeAtualizada);
            return res.status(200).json(atividadeAtualizada);
        }
        catch (erro) {
            // console.error("❌ Erro ao atualizar atividade:", erro);
            return res.status(500).json({
                erro: 'Erro interno ao atualizar atividade',
                mensagem: erro.message
            });
        }
    }
    async getAtividadesByVendedorAndDate(req, res) {
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
            const resultado = await this.obterAtividadesPorVendedorEData.executar(vendedorId, dataInicio, dataFim);
            console.log('Debug - Resultado obtido:', resultado);
            // Calcula o progresso em relação à meta
            let progresso = null;
            if (resultado.meta && resultado.meta.objetivo > 0) {
                progresso = (resultado.valorTotal / resultado.meta.objetivo) * 100;
            }
            return res.status(200).json(Object.assign(Object.assign({}, resultado), { progresso: progresso ? `${progresso.toFixed(2)}%` : null }));
        }
        catch (erro) {
            console.error('Debug - Erro:', erro);
            return res.status(500).json({
                erro: 'Erro interno ao obter atividades',
                mensagem: erro.message
            });
        }
    }
    async calcularFrequenciaVendas(req, res) {
        try {
            const { equipeId } = req.params;
            const { dataInicio, dataFim } = req.query;
            if (!dataInicio || !dataFim) {
                return res.status(400).json({
                    erro: 'Datas não fornecidas',
                    detalhes: { dataInicio, dataFim }
                });
            }
            const dataInicioObj = new Date(dataInicio);
            const dataFimObj = new Date(dataFim);
            const resultado = await this.frequenciaVendasService.calcularFrequencia(equipeId, dataInicioObj, dataFimObj);
            const fea = await this.atividadeService.calcularFEA(equipeId, resultado.totalDiasDisponiveis, resultado.diasComAtividade);
            return res.status(200).json({
                resultado
            });
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao calcular frequência de vendas',
                mensagem: erro.message
            });
        }
    }
}
exports.AtividadeController = AtividadeController;
//# sourceMappingURL=AtividadeController.js.map