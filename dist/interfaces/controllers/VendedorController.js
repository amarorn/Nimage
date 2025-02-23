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
    constructor(criarVendedor, obterVendedor, atualizarVendedor) {
        this.criarVendedor = criarVendedor;
        this.obterVendedor = obterVendedor;
        this.atualizarVendedor = atualizarVendedor;
    }
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // //console.log("📥 Dados recebidos no body:", req.body);
                // Validação dos dados de entrada
                if (!req.body) {
                    return res.status(400).json({ erro: 'Body da requisição está vazio' });
                }
                const { id, nome, equipe_id } = req.body;
                // Validação dos campos obrigatórios
                if (!id || !nome || !equipe_id) {
                    return res.status(400).json({
                        erro: 'Dados inválidos',
                        detalhes: {
                            id: id ? 'presente' : 'ausente',
                            nome: nome ? 'presente' : 'ausente',
                            equipe_id: equipe_id ? 'presente' : 'ausente'
                        }
                    });
                }
                // //console.log("✨ Dados extraídos:", { id, nome, equipe_id });
                const vendedor = yield this.criarVendedor.executar({ id, nome, equipe_id });
                // //console.log("✅ Vendedor criado com sucesso:", vendedor);
                return res.status(201).json(vendedor);
            }
            catch (erro) {
                // console.error("❌ Erro ao criar vendedor:", erro);
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
                // //console.log("✅ Vendedores obtidos com sucesso:", vendedores);
                // Criar uma resposta personalizada com paginação
                const respostaPersonalizada = {
                    pagina: page,
                    limite: limit,
                    total: vendedores.length,
                    vendedores: vendedores.map(vendedor => ({
                        id: vendedor.id,
                        nome: vendedor.nome,
                        equipe_id: vendedor.equipe_id,
                        equipeDetalhes: vendedor.equipeDetalhes
                    }))
                };
                return respostaPersonalizada;
            }
            catch (erro) {
                // console.error("❌ Erro ao obter vendedores:", erro);
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
                // //console.log("✅ Vendedor obtido com sucesso:", vendedor);
                if (!vendedor) {
                    return res.status(404).json({ erro: 'Vendedor não encontrado' });
                }
                return res.status(200).json({
                    id: vendedor.id,
                    nome: vendedor.nome,
                    equipe_id: vendedor.equipe_id,
                    equipeDetalhes: vendedor.equipeDetalhes
                });
            }
            catch (erro) {
                // console.error("❌ Erro ao obter vendedor:", erro);
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
                // //console.log("📥 Dados recebidos para atualização:", req.body);
                const { id } = req.params;
                const { nome, equipe_id } = req.body;
                // Validação dos campos obrigatórios
                if (!nome || !equipe_id) {
                    return res.status(400).json({
                        erro: 'Dados inválidos',
                        detalhes: {
                            nome: nome ? 'presente' : 'ausente',
                            equipe_id: equipe_id ? 'presente' : 'ausente'
                        }
                    });
                }
                const vendedorAtualizado = yield this.atualizarVendedor.executar(id, { nome, equipe_id });
                // //console.log("✅ Vendedor atualizado com sucesso:", vendedorAtualizado);
                return res.status(200).json(vendedorAtualizado);
            }
            catch (erro) {
                // console.error("❌ Erro ao atualizar vendedor:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao atualizar vendedor',
                    mensagem: erro.message
                });
            }
        });
    }
}
exports.VendedorController = VendedorController;
