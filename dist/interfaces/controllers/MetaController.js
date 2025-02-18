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
exports.MetaController = void 0;
class MetaController {
    constructor(criarMeta, obterMeta) {
        this.criarMeta = criarMeta;
        this.obterMeta = obterMeta;
    }
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const meta = yield this.criarMeta.executar({ id, equipeId, objetivo });
                console.log("✅ Meta criada com sucesso:", meta);
                return res.status(201).json(meta);
            }
            catch (erro) {
                console.error("❌ Erro ao criar meta:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao criar meta',
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
                const metas = yield this.obterMeta.executar(skip, limit);
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
            }
            catch (erro) {
                console.error("❌ Erro ao obter metas:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao obter metas',
                    mensagem: erro.message
                });
            }
        });
    }
    obterPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const meta = yield this.obterMeta.executarPorId(id);
                console.log("✅ Meta obtida com sucesso:", meta);
                if (!meta) {
                    return res.status(404).json({ erro: 'Meta não encontrada' });
                }
                return res.status(200).json(meta);
            }
            catch (erro) {
                console.error("❌ Erro ao obter meta:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao obter meta',
                    mensagem: erro.message
                });
            }
        });
    }
}
exports.MetaController = MetaController;
