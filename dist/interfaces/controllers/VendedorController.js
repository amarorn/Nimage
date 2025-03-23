"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendedorController = void 0;
class VendedorController {
    constructor(criarVendedor, obterVendedor, atualizarVendedor, getVendedorInsights) {
        this.criarVendedor = criarVendedor;
        this.obterVendedor = obterVendedor;
        this.atualizarVendedor = atualizarVendedor;
        this.getVendedorInsights = getVendedorInsights;
    }
    async criar(req, res) {
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
            const vendedor = await this.criarVendedor.executar({ id, nome, equipeId, email, telefone, meta, cargo });
            return res.status(201).json(vendedor);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao criar vendedor',
                mensagem: erro.message
            });
        }
    }
    async obterTodos(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const vendedores = await this.obterVendedor.executar(skip, limit);
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
    }
    async obterPorId(req, res) {
        try {
            const { id } = req.params;
            const vendedor = await this.obterVendedor.executarPorId(id);
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
    }
    async atualizar(req, res) {
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
            const vendedorAtualizado = await this.atualizarVendedor.executar(id, camposAtualizacao);
            return res.status(200).json(vendedorAtualizado);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao atualizar vendedor',
                mensagem: erro.message
            });
        }
    }
    async obterInsights(req, res) {
        try {
            const { id } = req.params;
            const { mes } = req.query;
            console.log("🚀 Iniciando obterInsights");
            console.log("ID do vendedor:", id);
            console.log("Mês requisitado:", mes);
            if (!id) {
                console.error("ID do vendedor não fornecido");
                return res.status(400).json({ error: "ID do vendedor é obrigatório" });
            }
            const insights = await this.getVendedorInsights.execute(id, mes);
            console.log("✅ Insights obtidos com sucesso:", insights);
            return res.json(insights);
        }
        catch (error) {
            console.error('❌ Erro ao obter insights do vendedor:', error);
            return res.status(500).json({
                error: 'Erro ao obter insights do vendedor',
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
}
exports.VendedorController = VendedorController;
//# sourceMappingURL=VendedorController.js.map