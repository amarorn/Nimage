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
            const { id, nome, nomepdv, cidade, estado, gerente, contato_gerente, capitao, contato_capitao } = req.body;
            // Validação dos campos obrigatórios
            if (!id || !nome || !nomepdv || !cidade || !estado ||
                !gerente || !contato_gerente || !capitao || !contato_capitao) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        nome: nome ? 'presente' : 'ausente',
                        nomepdv: nomepdv ? 'presente' : 'ausente',
                        cidade: cidade ? 'presente' : 'ausente',
                        estado: estado ? 'presente' : 'ausente',
                        gerente: gerente ? 'presente' : 'ausente',
                        contato_gerente: contato_gerente ? 'presente' : 'ausente',
                        capitao: capitao ? 'presente' : 'ausente',
                        contato_capitao: contato_capitao ? 'presente' : 'ausente'
                    }
                });
            }
            const equipe = await this.criarEquipe.executar({
                id,
                nome,
                nomepdv,
                cidade,
                estado,
                gerente,
                contato_gerente,
                capitao,
                contato_capitao
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
                        nomepdv: equipe.nomepdv,
                        cidade: equipe.cidade,
                        estado: equipe.estado,
                        gerente: equipe.gerente,
                        contato_gerente: equipe.contato_gerente,
                        capitao: equipe.capitao,
                        contato_capitao: equipe.contato_capitao
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
                    nomepdv: equipe.nomepdv,
                    cidade: equipe.cidade,
                    estado: equipe.estado,
                    gerente: equipe.gerente,
                    contato_gerente: equipe.contato_gerente,
                    capitao: equipe.capitao,
                    contato_capitao: equipe.contato_capitao
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
                nomepdv: equipe.nomepdv,
                cidade: equipe.cidade,
                estado: equipe.estado,
                gerente: equipe.gerente,
                contato_gerente: equipe.contato_gerente,
                capitao: equipe.capitao,
                contato_capitao: equipe.contato_capitao
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
            const { nome, nomepdv, cidade, estado, gerente, contato_gerente, capitao, contato_capitao } = req.body;
            // Validação dos campos
            const camposAtualizacao = {
                nome,
                nomepdv,
                cidade,
                estado,
                gerente,
                contato_gerente,
                capitao,
                contato_capitao
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
                nomepdv: equipeAtualizada.nomepdv,
                cidade: equipeAtualizada.cidade,
                estado: equipeAtualizada.estado,
                gerente: equipeAtualizada.gerente,
                contato_gerente: equipeAtualizada.contato_gerente,
                capitao: equipeAtualizada.capitao,
                contato_capitao: equipeAtualizada.contato_capitao
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