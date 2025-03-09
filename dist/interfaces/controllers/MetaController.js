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
    constructor(criarMeta, obterMeta, atualizarMeta) {
        this.criarMeta = criarMeta;
        this.obterMeta = obterMeta;
        this.atualizarMeta = atualizarMeta;
    }
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body) {
                    return res.status(400).json({ erro: 'Body da requisição está vazio' });
                }
                const { id, equipeId, objetivo, mes } = req.body;
                // Validação dos campos obrigatórios
                if (!id || !equipeId || objetivo === undefined || !mes) {
                    return res.status(400).json({
                        erro: 'Dados inválidos',
                        detalhes: {
                            id: id ? 'presente' : 'ausente',
                            equipeId: equipeId ? 'presente' : 'ausente',
                            objetivo: objetivo !== undefined ? 'presente' : 'ausente',
                            mes: mes ? 'presente' : 'ausente'
                        }
                    });
                }
                // Validação do mês
                const mesNum = parseInt(mes);
                if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
                    return res.status(400).json({
                        erro: 'Mês inválido',
                        detalhes: { mes: mesNum }
                    });
                }
                // Pega o ano atual
                const anoAtual = new Date().getFullYear();
                // Cria a data com o primeiro dia do mês
                const data = new Date(anoAtual, mesNum - 1, 1);
                const meta = yield this.criarMeta.executar({
                    id,
                    equipeId,
                    objetivo,
                    data
                });
                return res.status(201).json(meta);
            }
            catch (erro) {
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
                const respostaPersonalizada = {
                    pagina: page,
                    statuscode: 200,
                    limite: limit,
                    total: metas.length,
                    metas: metas.map(meta => ({
                        id: meta.id,
                        equipeId: meta.equipeId,
                        objetivo: meta.objetivo,
                        data: meta.data,
                        mes: meta.data.getMonth() + 1,
                        ano: meta.data.getFullYear()
                    }))
                };
                return respostaPersonalizada;
            }
            catch (erro) {
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
                if (!meta) {
                    return res.status(404).json({ erro: 'Meta não encontrada' });
                }
                return res.status(200).json({
                    id: meta.id,
                    equipeId: meta.equipeId,
                    objetivo: meta.objetivo,
                    data: meta.data
                });
            }
            catch (erro) {
                return res.status(500).json({
                    erro: 'Erro interno ao obter meta',
                    mensagem: erro.message
                });
            }
        });
    }
    obterPorEquipe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { equipeId } = req.params;
                const meta = yield this.obterMeta.executarPorEquipe(equipeId);
                if (!meta) {
                    return res.status(404).json({ erro: 'Meta não encontrada para esta equipe' });
                }
                return res.status(200).json({
                    status: 'success',
                    data: {
                        id: meta.id,
                        equipeId: meta.equipeId,
                        objetivo: meta.objetivo,
                        data: meta.data
                    }
                });
            }
            catch (erro) {
                return res.status(500).json({
                    erro: 'Erro interno ao obter meta por equipe',
                    mensagem: erro.message
                });
            }
        });
    }
    atualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { equipeId, objetivo, mes } = req.body;
                if (!equipeId || objetivo === undefined || !mes) {
                    return res.status(400).json({
                        erro: 'Dados inválidos',
                        detalhes: {
                            equipeId: equipeId ? 'presente' : 'ausente',
                            objetivo: objetivo !== undefined ? 'presente' : 'ausente',
                            mes: mes ? 'presente' : 'ausente'
                        }
                    });
                }
                // Validação do mês
                const mesNum = parseInt(mes);
                if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
                    return res.status(400).json({
                        erro: 'Mês inválido',
                        detalhes: { mes: mesNum }
                    });
                }
                // Pega o ano atual
                const anoAtual = new Date().getFullYear();
                const data = new Date(anoAtual, mesNum - 1, 1);
                const metaAtualizada = yield this.atualizarMeta.executar(id, {
                    equipeId,
                    objetivo,
                    data
                });
                return res.status(200).json(metaAtualizada);
            }
            catch (erro) {
                return res.status(500).json({
                    erro: 'Erro interno ao atualizar meta',
                    mensagem: erro.message
                });
            }
        });
    }
}
exports.MetaController = MetaController;
