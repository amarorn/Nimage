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
exports.EquipeController = void 0;
class EquipeController {
    constructor(criarEquipe, obterEquipe, obterEquipeDadosFull, equipeMetaService, atualizarEquipe) {
        this.criarEquipe = criarEquipe;
        this.obterEquipe = obterEquipe;
        this.obterEquipeDadosFull = obterEquipeDadosFull;
        this.equipeMetaService = equipeMetaService;
        this.atualizarEquipe = atualizarEquipe;
    }
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // //console.log("📥 Dados recebidos no body:", req.body);
                if (!req.body) {
                    return res.status(400).json({ erro: 'Body da requisição está vazio' });
                }
                const { id, nome } = req.body;
                // Validação dos campos obrigatórios
                if (!id || !nome) {
                    return res.status(400).json({
                        erro: 'Dados inválidos',
                        detalhes: {
                            id: id ? 'presente' : 'ausente',
                            nome: nome ? 'presente' : 'ausente'
                        }
                    });
                }
                // //console.log("✨ Dados extraídos:", { id, nome });
                const equipe = yield this.criarEquipe.executar({ id, nome });
                // //console.log("✅ Equipe criada com sucesso:", equipe);
                return res.status(201).json(equipe);
            }
            catch (erro) {
                // console.error("❌ Erro ao criar equipe:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao criar equipe',
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
                const equipes = yield this.obterEquipe.executar(skip, limit);
                // //console.log("✅ Equipes obtidas com sucesso:", equipes);
                // Criar uma resposta personalizada com paginação
                const respostaPersonalizada = {
                    pagina: page,
                    limite: limit,
                    total: equipes.length,
                    equipes: equipes.map(equipe => ({
                        id: equipe.id,
                        nome: equipe.nome
                    }))
                };
                return respostaPersonalizada;
            }
            catch (erro) {
                // console.error("❌ Erro ao obter equipes:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao obter equipes',
                    mensagem: erro.message
                });
            }
        });
    }
    obterPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const equipe = yield this.obterEquipe.executarPorId(id);
                // //console.log("✅ Equipe obtida com sucesso:", equipe);
                if (!equipe) {
                    return res.status(404).json({ erro: 'Equipe não encontrada' });
                }
                return res.status(200).json(equipe);
            }
            catch (erro) {
                // console.error("❌ Erro ao obter equipe:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao obter equipe',
                    mensagem: erro.message
                });
            }
        });
    }
    obterDadosFull(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // //console.log("🔍 Recebendo requisição para obter dados completos da equipe", req.params);
                const { equipeId } = req.params;
                const dadosCompletos = yield this.obterEquipeDadosFull.executar(equipeId);
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
        });
    }
    calcularMeta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { equipeId } = req.params;
                // //console.log("🔍 Calculando meta para equipe ID:", equipeId);
                const resultado = yield this.equipeMetaService.calcularMeta(equipeId);
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
        });
    }
    atualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // //console.log("📥 Dados recebidos para atualização:", req.body);
                const { id } = req.params;
                const { nome } = req.body;
                // Validação dos campos obrigatórios
                if (!nome) {
                    return res.status(400).json({
                        erro: 'Dados inválidos',
                        detalhes: {
                            nome: nome ? 'presente' : 'ausente'
                        }
                    });
                }
                const equipeAtualizada = yield this.atualizarEquipe.executar(id, { nome });
                // //console.log("✅ Equipe atualizada com sucesso:", equipeAtualizada);
                return res.status(200).json(equipeAtualizada);
            }
            catch (erro) {
                // console.error("❌ Erro ao atualizar equipe:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao atualizar equipe',
                    mensagem: erro.message
                });
            }
        });
    }
}
exports.EquipeController = EquipeController;
