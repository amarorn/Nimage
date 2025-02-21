"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtividadeController = void 0;
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
class AtividadeController {
    constructor(criarAtividade, obterAtividades) {
        this.criarAtividade = criarAtividade;
        this.obterAtividades = obterAtividades;
    }
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const atividade = yield this.criarAtividade.executar({
                    id,
                    vendedorId,
                    data: new Date(data),
                    docinhosCoco
                });
                console.log("✅ Atividade criada com sucesso:", atividade);
                return res.status(201).json(atividade);
            }
            catch (erro) {
                console.error("❌ Erro ao criar atividade:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao criar atividade',
                    mensagem: erro.message
                });
            }
        });
    }
    obterTodos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const skip = (page - 1) * limit;
                const atividades = yield this.obterAtividades.executar(skip, limit);
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
            }
            catch (erro) {
                console.error("❌ Erro ao obter atividades:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao obter atividades',
                    mensagem: erro.message
                });
            }
        });
    }
    obterPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const atividade = yield this.obterAtividades.executarPorId(id);
                console.log("✅ Atividade obtida com sucesso:", atividade);
                if (!atividade) {
                    return res.status(404).json({ erro: 'Atividade não encontrada' });
                }
                return res.status(200).json(atividade);
            }
            catch (erro) {
                console.error("❌ Erro ao obter atividade:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao obter atividade',
                    mensagem: erro.message
                });
            }
        });
    }
    obterDetalhes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log("🔍 Buscando detalhes para atividade ID:", id);
                const atividade = yield this.obterAtividades.executarPorId(id);
                if (!atividade) {
                    console.log("⚠️ Atividade não encontrada");
                    return res.status(404).json({ erro: 'Atividade não encontrada' });
                }
                const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
                const vendedor = yield vendedorRepo.obterPorId(atividade.vendedorId);
                if (!vendedor) {
                    console.log("⚠️ Vendedor não encontrado");
                    return res.status(404).json({ erro: 'Vendedor não encontrado' });
                }
                const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
                const equipe = yield equipeRepo.obterPorId(vendedor.equipe_id);
                if (!equipe) {
                    console.log("⚠️ Equipe não encontrada");
                    return res.status(404).json({ erro: 'Equipe não encontrada' });
                }
                const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
                const metas = yield metaRepo.obterPorEquipe(equipe.id);
                console.log("✅ Detalhes obtidos com sucesso:", { atividade, vendedor, equipe, metas });
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
            }
            catch (erro) {
                console.error("❌ Erro ao obter detalhes da atividade:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao obter detalhes da atividade',
                    mensagem: erro.message
                });
            }
        });
    }
}
exports.AtividadeController = AtividadeController;
