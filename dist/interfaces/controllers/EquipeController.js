"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeController = void 0;
const EquipeCacheService_1 = require("../../infrastructure/cache/EquipeCacheService");
class EquipeController {
    constructor(criarEquipe, obterEquipe, obterEquipeDadosFull, equipeMetaService, atualizarEquipe) {
        this.criarEquipe = criarEquipe;
        this.obterEquipe = obterEquipe;
        this.obterEquipeDadosFull = obterEquipeDadosFull;
        this.equipeMetaService = equipeMetaService;
        this.atualizarEquipe = atualizarEquipe;
        this.equipeCache = EquipeCacheService_1.EquipeCacheService.getInstance();
    }
    async criar(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }
            const { id, nome, pdv, cidade, estado, gerenteNome, gerenteTelefone, capitaoNome, capitaoTelefone, temaId } = req.body;
            // Validação dos campos obrigatórios
            if (!id || !nome || !pdv || !cidade || !estado || !gerenteNome || !gerenteTelefone || !capitaoNome || !capitaoTelefone) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        nome: nome ? 'presente' : 'ausente',
                        pdv: pdv ? 'presente' : 'ausente',
                        cidade: cidade ? 'presente' : 'ausente',
                        estado: estado ? 'presente' : 'ausente',
                        gerenteNome: gerenteNome ? 'presente' : 'ausente',
                        gerenteTelefone: gerenteTelefone ? 'presente' : 'ausente',
                        capitaoNome: capitaoNome ? 'presente' : 'ausente',
                        capitaoTelefone: capitaoTelefone ? 'presente' : 'ausente'
                    }
                });
            }
            const equipe = await this.criarEquipe.executar({
                id,
                nome,
                pdv,
                cidade,
                estado,
                gerenteNome,
                gerenteTelefone,
                capitaoNome,
                capitaoTelefone,
                temaId
            });
            return res.status(201).json(equipe);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao criar equipe',
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
            const cachedEquipes = await this.equipeCache.getEquipes();
            if (cachedEquipes) {
                console.log('📦 Cache hit: Equipes encontradas no cache');
                return res.status(200).json({
                    pagina: page,
                    limite: limit,
                    total: cachedEquipes.length,
                    equipes: cachedEquipes.map((equipe) => ({
                        id: equipe.id,
                        nome: equipe.nome,
                        pdv: equipe.pdv,
                        cidade: equipe.cidade,
                        estado: equipe.estado,
                        gerenteNome: equipe.gerenteNome,
                        gerenteTelefone: equipe.gerenteTelefone,
                        capitaoNome: equipe.capitaoNome,
                        capitaoTelefone: equipe.capitaoTelefone,
                        temaId: equipe.temaId
                    }))
                });
            }
            console.log('🔄 Cache miss: Buscando equipes do banco');
            const equipes = await this.obterEquipe.executar(skip, limit);
            // Salva no cache
            await this.equipeCache.setEquipes(equipes);
            console.log('💾 Cache: Equipes salvas no cache');
            return res.status(200).json({
                pagina: page,
                limite: limit,
                total: equipes.length,
                equipes: equipes.map((equipe) => ({
                    id: equipe.id,
                    nome: equipe.nome,
                    pdv: equipe.pdv,
                    cidade: equipe.cidade,
                    estado: equipe.estado,
                    gerenteNome: equipe.gerenteNome,
                    gerenteTelefone: equipe.gerenteTelefone,
                    capitaoNome: equipe.capitaoNome,
                    capitaoTelefone: equipe.capitaoTelefone,
                    temaId: equipe.temaId
                }))
            });
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter equipes',
                mensagem: erro.message
            });
        }
    }
    async obterPorId(req, res) {
        try {
            const { id } = req.params;
            const equipe = await this.obterEquipe.executarPorId(id);
            if (!equipe) {
                return res.status(404).json({ erro: 'Equipe não encontrada' });
            }
            return res.status(200).json({
                id: equipe.id,
                nome: equipe.nome,
                pdv: equipe.pdv,
                cidade: equipe.cidade,
                estado: equipe.estado,
                gerenteNome: equipe.gerenteNome,
                gerenteTelefone: equipe.gerenteTelefone,
                capitaoNome: equipe.capitaoNome,
                capitaoTelefone: equipe.capitaoTelefone,
                temaId: equipe.temaId
            });
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter equipe',
                mensagem: erro.message
            });
        }
    }
    async obterDadosFull(req, res) {
        try {
            // //console.log("🔍 Recebendo requisição para obter dados completos da equipe", req.params);
            const { equipeId } = req.params;
            const dadosCompletos = await this.obterEquipeDadosFull.executar(equipeId);
            // //console.log("✅ Dados completos obtidos com sucesso");
            return res.status(200).json({
                status: 'success',
                data: dadosCompletos
            });
        }
        catch (erro) {
            // console.error("❌ Erro ao obter dados completos da equipe:", erro);
            return res.status(500).json({
                erro: 'Erro interno ao obter dados completos da equipe',
                mensagem: erro.message
            });
        }
    }
    async calcularMeta(req, res) {
        try {
            const { equipeId } = req.params;
            // //console.log("🔍 Calculando meta para equipe ID:", equipeId);
            const resultado = await this.equipeMetaService.calcularMeta(equipeId);
            // //console.log("✅ Resultado do cálculo de meta:", resultado);
            return res.status(200).json({
                status: 'success',
                data: resultado
            });
        }
        catch (erro) {
            // console.error("❌ Erro ao calcular meta:", erro);
            return res.status(500).json({
                erro: 'Erro interno ao calcular meta',
                mensagem: erro.message
            });
        }
    }
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, pdv, cidade, estado, gerenteNome, gerenteTelefone, capitaoNome, capitaoTelefone, temaId } = req.body;
            // Validação dos campos
            const camposAtualizacao = {
                nome,
                pdv,
                cidade,
                estado,
                gerenteNome,
                gerenteTelefone,
                capitaoNome,
                capitaoTelefone,
                temaId
            };
            // Filtra apenas os campos que foram fornecidos
            const dadosAtualizacao = Object.entries(camposAtualizacao)
                .filter(([_, valor]) => valor !== undefined)
                .reduce((acc, [chave, valor]) => (Object.assign(Object.assign({}, acc), { [chave]: valor })), {});
            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(400).json({
                    erro: 'Nenhum campo válido para atualização foi fornecido'
                });
            }
            const equipeAtualizada = await this.atualizarEquipe.executar(id, dadosAtualizacao);
            if (!equipeAtualizada) {
                return res.status(404).json({ erro: 'Equipe não encontrada' });
            }
            // Invalida o cache da meta da equipe
            await this.equipeMetaService.invalidarCache(id);
            return res.status(200).json({
                id: equipeAtualizada.id,
                nome: equipeAtualizada.nome,
                pdv: equipeAtualizada.pdv,
                cidade: equipeAtualizada.cidade,
                estado: equipeAtualizada.estado,
                gerenteNome: equipeAtualizada.gerenteNome,
                gerenteTelefone: equipeAtualizada.gerenteTelefone,
                capitaoNome: equipeAtualizada.capitaoNome,
                capitaoTelefone: equipeAtualizada.capitaoTelefone,
                temaId: equipeAtualizada.temaId
            });
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao atualizar equipe',
                mensagem: erro.message
            });
        }
    }
}
exports.EquipeController = EquipeController;
//# sourceMappingURL=EquipeController.js.map