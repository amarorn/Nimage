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
    constructor(criarVendedor) {
        this.criarVendedor = criarVendedor;
    }
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("📥 Dados recebidos no body:", req.body);
                // Validação dos dados de entrada
                if (!req.body) {
                    return res.status(400).json({ erro: 'Body da requisição está vazio' });
                }
                const { id, nome, equipe } = req.body;
                // Validação dos campos obrigatórios
                if (!id || !nome || !equipe) {
                    return res.status(400).json({
                        erro: 'Dados inválidos',
                        detalhes: {
                            id: id ? 'presente' : 'ausente',
                            nome: nome ? 'presente' : 'ausente',
                            equipe: equipe ? 'presente' : 'ausente'
                        }
                    });
                }
                console.log("✨ Dados extraídos:", { id, nome, equipe });
                const vendedor = yield this.criarVendedor.executar({ id, nome, equipe });
                console.log("✅ Vendedor criado com sucesso:", vendedor);
                return res.status(201).json(vendedor);
            }
            catch (erro) {
                console.error("❌ Erro ao criar vendedor:", erro);
                return res.status(500).json({
                    erro: 'Erro interno ao criar vendedor',
                    mensagem: erro.message
                });
            }
        });
    }
}
exports.VendedorController = VendedorController;
