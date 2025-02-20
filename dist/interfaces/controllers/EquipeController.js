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
    constructor(criarEquipe, obterEquipe, obterTotaisPorEquipe) {
        this.criarEquipe = criarEquipe;
        this.obterEquipe = obterEquipe;
        this.obterTotaisPorEquipe = obterTotaisPorEquipe;
    }
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("📥 Dados recebidos no body:", req.body);
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
                console.log("✨ Dados extraídos:", { id, nome });
                const equipe = yield this.criarEquipe.executar({ id, nome });
                console.log("✅ Equipe criada com sucesso:", equipe);
                return res.status(201).json(equipe);
            }
            catch (erro) {
                console.error("❌ Erro ao criar equipe:", erro);
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
                console.log("✅ Equipes obtidas com sucesso:", equipes);
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
                console.error("❌ Erro ao obter equipes:", erro);
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
                console.log("✅ Equipe obtida com sucesso:", equipe);
                if (!equipe) {
                    return res.status(404).json({ erro: 'Equipe não encontrada' });
                }
                return res.status(200).json(equipe);
            }
            catch (erro) {
                console.error("❌ Erro ao obter equipe:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao obter equipe',
                    mensagem: erro.message
                });
            }
        });
    }
    obterTotais(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { equipeId } = req.params;
                const totais = yield this.obterTotaisPorEquipe.executar(equipeId);
                return res.status(200).json(totais);
            }
            catch (erro) {
                console.error("❌ Erro ao obter totais por equipe:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao obter totais por equipe',
                    mensagem: erro.message
                });
            }
        });
    }
}
exports.EquipeController = EquipeController;
