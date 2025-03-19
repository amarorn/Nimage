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
exports.VendedorController = void 0;
class VendedorController {
    constructor(criarVendedor, obterVendedor, atualizarVendedor, getVendedorInsights) {
        this.criarVendedor = criarVendedor;
        this.obterVendedor = obterVendedor;
        this.atualizarVendedor = atualizarVendedor;
        this.getVendedorInsights = getVendedorInsights;
    }
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body) {
                    return res.status(400).json({ erro: 'Body da requisição está vazio' });
                }
                const { id, nome, equipeId, email, telefone, meta, cargo } = req.body;
                // Validação dos campos obrigatórios
                if (!id || !nome || !equipeId || !email || !telefone || !meta || !cargo) {
                    return res.status(400).json({
                        erro: 'Dados inválidos',
                        detalhes: {
                            id: id ? 'presente' : 'ausente',
                            nome: nome ? 'presente' : 'ausente',
                            equipeId: equipeId ? 'presente' : 'ausente',
                            email: email ? 'presente' : 'ausente',
                            telefone: telefone ? 'presente' : 'ausente',
                            meta: meta ? 'presente' : 'ausente',
                            cargo: cargo ? 'presente' : 'ausente'
                        }
                    });
                }
                const vendedor = yield this.criarVendedor.executar({ id, nome, equipeId, email, telefone, meta, cargo });
                return res.status(201).json(vendedor);
            }
            catch (erro) {
                return res.status(500).json({
                    erro: 'Erro interno ao criar vendedor',
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
                const vendedores = yield this.obterVendedor.executar(skip, limit);
                const respostaPersonalizada = {
                    pagina: page,
                    limite: limit,
                    total: vendedores.length,
                    vendedores: vendedores.map(vendedor => ({
                        id: vendedor.id,
                        nome: vendedor.nome,
                        equipeId: vendedor.equipeId,
                        email: vendedor.email,
                        telefone: vendedor.telefone,
                        meta: vendedor.meta,
                        cargo: vendedor.cargo
                    }))
                };
                return respostaPersonalizada;
            }
            catch (erro) {
                return res.status(500).json({
                    erro: 'Erro interno ao obter vendedores',
                    mensagem: erro.message
                });
            }
        });
    }
    obterPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const vendedor = yield this.obterVendedor.executarPorId(id);
                if (!vendedor) {
                    return res.status(404).json({ erro: 'Vendedor não encontrado' });
                }
                return res.status(200).json({
                    id: vendedor.id,
                    nome: vendedor.nome,
                    equipeId: vendedor.equipeId,
                    email: vendedor.email,
                    telefone: vendedor.telefone,
                    meta: vendedor.meta,
                    cargo: vendedor.cargo
                });
            }
            catch (erro) {
                return res.status(500).json({
                    erro: 'Erro interno ao obter vendedor',
                    mensagem: erro.message
                });
            }
        });
    }
    atualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, equipeId, email, telefone, meta, cargo } = req.body;
                // Validação dos campos obrigatórios
                const camposAtualizacao = { nome, equipeId, email, telefone, meta, cargo };
                const camposVazios = Object.entries(camposAtualizacao)
                    .filter(([_, valor]) => valor !== undefined && !valor)
                    .map(([campo]) => campo);
                if (camposVazios.length > 0) {
                    return res.status(400).json({
                        erro: 'Dados inválidos',
                        detalhes: `Os seguintes campos estão vazios: ${camposVazios.join(', ')}`
                    });
                }
                const vendedorAtualizado = yield this.atualizarVendedor.executar(id, camposAtualizacao);
                return res.status(200).json(vendedorAtualizado);
            }
            catch (erro) {
                return res.status(500).json({
                    erro: 'Erro interno ao atualizar vendedor',
                    mensagem: erro.message
                });
            }
        });
    }
    obterInsights(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { mes } = req.query;
                const insights = yield this.getVendedorInsights.execute(id, mes);
                return res.json(insights);
            }
            catch (error) {
                console.error('Erro ao obter insights do vendedor:', error);
                return res.status(400).json({ error: 'Erro ao obter insights do vendedor' });
            }
        });
    }
}
exports.VendedorController = VendedorController;
//# sourceMappingURL=VendedorController.js.map