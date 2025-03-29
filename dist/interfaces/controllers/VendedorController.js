"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendedorController = void 0;
const VendedorCacheService_1 = require("../../infrastructure/cache/VendedorCacheService");
class VendedorController {
    constructor(criarVendedor, obterVendedor, atualizarVendedor, getVendedorInsights) {
        this.criarVendedor = criarVendedor;
        this.obterVendedor = obterVendedor;
        this.atualizarVendedor = atualizarVendedor;
        this.getVendedorInsights = getVendedorInsights;
        this.vendedorCache = VendedorCacheService_1.VendedorCacheService.getInstance();
    }
    async criar(req, res) {
        try {
            const { id, nome, equipeId, email, telefone, meta, cargo } = req.body;
            // Validação dos campos obrigatórios
            const camposObrigatorios = {
                id: id,
                nome: nome,
                equipeId: equipeId,
                email: email,
                telefone: telefone,
                meta: meta,
                cargo: cargo
            };
            const camposAusentes = Object.entries(camposObrigatorios)
                .filter(([_, valor]) => !valor)
                .map(([campo]) => campo);
            const camposPresentes = Object.entries(camposObrigatorios)
                .filter(([_, valor]) => valor)
                .map(([campo]) => campo);
            if (camposAusentes.length > 0) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: Object.assign(Object.assign({}, camposAusentes.reduce((acc, campo) => (Object.assign(Object.assign({}, acc), { [campo]: 'ausente' })), {})), camposPresentes.reduce((acc, campo) => (Object.assign(Object.assign({}, acc), { [campo]: 'presente' })), {}))
                });
            }
            await this.criarVendedor.executar({
                id,
                nome,
                equipeId,
                email,
                telefone,
                meta,
                cargo
            });
            // Invalida o cache após criar um novo vendedor
            await this.vendedorCache.invalidateAll();
            return res.status(201).json({ mensagem: 'Vendedor criado com sucesso' });
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
            // Busca direto do banco de dados
            console.log('🔄 Buscando vendedores do banco');
            const vendedores = await this.obterVendedor.executar(skip, limit);
            return res.status(200).json({
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
            });
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
            const vendedorAtualizado = await this.atualizarVendedor.executar(id, {
                nome,
                equipeId,
                email,
                telefone,
                meta,
                cargo
            });
            if (!vendedorAtualizado) {
                return res.status(404).json({ erro: 'Vendedor não encontrado' });
            }
            // Invalida o cache após atualizar um vendedor
            await this.vendedorCache.invalidateAll();
            return res.status(200).json({
                id: vendedorAtualizado.id,
                nome: vendedorAtualizado.nome,
                equipeId: vendedorAtualizado.equipeId,
                email: vendedorAtualizado.email,
                telefone: vendedorAtualizado.telefone,
                meta: vendedorAtualizado.meta,
                cargo: vendedorAtualizado.cargo
            });
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
            const insights = await this.getVendedorInsights.execute(id);
            return res.status(200).json(insights);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter insights do vendedor',
                mensagem: erro.message
            });
        }
    }
}
exports.VendedorController = VendedorController;
//# sourceMappingURL=VendedorController.js.map