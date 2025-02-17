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
class AtividadeController {
    constructor(criarAtividade) {
        this.criarAtividade = criarAtividade;
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
}
exports.AtividadeController = AtividadeController;
