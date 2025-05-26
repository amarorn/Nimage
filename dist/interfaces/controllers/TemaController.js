"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemaController = void 0;
class TemaController {
    constructor(criarTema, obterTema, atualizarTema, temaRepo) {
        this.criarTema = criarTema;
        this.obterTema = obterTema;
        this.atualizarTema = atualizarTema;
        this.temaRepo = temaRepo;
    }
    async criar(req, res) {
        try {
            const { nome, descricao, cor } = req.body;
            if (!nome || !descricao || !cor) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        nome: nome ? 'presente' : 'ausente',
                        descricao: descricao ? 'presente' : 'ausente',
                        cor: cor ? 'presente' : 'ausente'
                    }
                });
            }
            const tema = await this.criarTema.executar({ nome, descricao, cor });
            return res.status(201).json(tema);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao criar tema',
                mensagem: erro.message
            });
        }
    }
    async obterTodos(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const { temas, total } = await this.obterTema.executar(skip, limit);
            return res.status(200).json({
                pagina: page,
                limite: limit,
                total,
                totalPaginas: Math.ceil(total / limit),
                temas
            });
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter temas',
                mensagem: erro.message
            });
        }
    }
    async obterPorId(req, res) {
        try {
            const { id } = req.params;
            const tema = await this.obterTema.executarPorId(id);
            if (!tema) {
                return res.status(404).json({ erro: 'Tema não encontrado' });
            }
            return res.status(200).json(tema);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter tema',
                mensagem: erro.message
            });
        }
    }
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, cor } = req.body;
            if (!nome || !descricao || !cor) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        nome: nome ? 'presente' : 'ausente',
                        descricao: descricao ? 'presente' : 'ausente',
                        cor: cor ? 'presente' : 'ausente'
                    }
                });
            }
            const temaAtualizado = await this.atualizarTema.executar(id, { nome, descricao, cor });
            if (!temaAtualizado) {
                return res.status(404).json({ erro: 'Tema não encontrado' });
            }
            return res.status(200).json(temaAtualizado);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao atualizar tema',
                mensagem: erro.message
            });
        }
    }
    async deletar(req, res) {
        try {
            const { id } = req.params;
            await this.temaRepo.deletar(id);
            return res.status(204).send();
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao deletar tema',
                mensagem: erro.message
            });
        }
    }
}
exports.TemaController = TemaController;
//# sourceMappingURL=TemaController.js.map