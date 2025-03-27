"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaController = void 0;
class CategoriaController {
    constructor(criarCategoria, obterCategoria, atualizarCategoria, categoriaRepo) {
        this.criarCategoria = criarCategoria;
        this.obterCategoria = obterCategoria;
        this.atualizarCategoria = atualizarCategoria;
        this.categoriaRepo = categoriaRepo;
    }
    async criar(req, res) {
        try {
            const { id, nome, descricao, icone, ativo } = req.body;
            if (!id || !nome || !descricao || !icone || ativo === undefined) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        nome: nome ? 'presente' : 'ausente',
                        descricao: descricao ? 'presente' : 'ausente',
                        icone: icone ? 'presente' : 'ausente',
                        ativo: ativo !== undefined ? 'presente' : 'ausente'
                    }
                });
            }
            const categoria = await this.criarCategoria.executar({ id, nome, descricao, icone, ativo });
            return res.status(201).json(categoria);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao criar categoria',
                mensagem: erro.message
            });
        }
    }
    async obterTodos(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const { categorias, total } = await this.obterCategoria.executar(skip, limit);
            return res.status(200).json({
                pagina: page,
                limite: limit,
                total,
                totalPaginas: Math.ceil(total / limit),
                categorias
            });
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter categorias',
                mensagem: erro.message
            });
        }
    }
    async obterPorId(req, res) {
        try {
            const { id } = req.params;
            const categoria = await this.obterCategoria.executarPorId(id);
            if (!categoria) {
                return res.status(404).json({ erro: 'Categoria não encontrada' });
            }
            return res.status(200).json(categoria);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter categoria',
                mensagem: erro.message
            });
        }
    }
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, icone, ativo } = req.body;
            if (!nome || !descricao || !icone || ativo === undefined) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        nome: nome ? 'presente' : 'ausente',
                        descricao: descricao ? 'presente' : 'ausente',
                        icone: icone ? 'presente' : 'ausente',
                        ativo: ativo !== undefined ? 'presente' : 'ausente'
                    }
                });
            }
            const categoriaAtualizada = await this.atualizarCategoria.executar(id, { nome, descricao, icone, ativo });
            if (!categoriaAtualizada) {
                return res.status(404).json({ erro: 'Categoria não encontrada' });
            }
            return res.status(200).json(categoriaAtualizada);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao atualizar categoria',
                mensagem: erro.message
            });
        }
    }
    async deletar(req, res) {
        try {
            const { id } = req.params;
            await this.categoriaRepo.deletar(id);
            return res.status(204).send();
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao deletar categoria',
                mensagem: erro.message
            });
        }
    }
}
exports.CategoriaController = CategoriaController;
//# sourceMappingURL=CategoriaController.js.map