"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LojaController = void 0;
const uuid_1 = require("uuid");
class LojaController {
    constructor(criarLoja, atualizarLoja, obterLoja, deletarLoja) {
        this.criarLoja = criarLoja;
        this.atualizarLoja = atualizarLoja;
        this.obterLoja = obterLoja;
        this.deletarLoja = deletarLoja;
    }
    async criar(req, res) {
        try {
            const id = (0, uuid_1.v4)();
            const { nome, cnpj, telefone, montadoraId } = req.body;
            if (!nome || !cnpj || !telefone || !montadoraId) {
                return res.status(400).json({ error: 'Campos obrigatórios ausentes', detalhes: { nome, cnpj, telefone, montadoraId } });
            }
            const loja = await this.criarLoja.executar({ id, nome, cnpj, telefone, montadoraId });
            res.status(201).json(loja);
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao criar loja' });
        }
    }
    async obterTodos(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;
            const skip = (pagina - 1) * limite;
            const resultado = await this.obterLoja.executar(skip, limite);
            res.json(resultado);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter lojas' });
        }
    }
    async obterPorId(req, res) {
        try {
            const { id } = req.params;
            const loja = await this.obterLoja.executarPorId(id);
            if (!loja) {
                return res.status(404).json({ error: 'Loja não encontrada' });
            }
            res.json(loja);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter loja' });
        }
    }
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const loja = await this.atualizarLoja.executar(id, req.body);
            res.json(loja);
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao atualizar loja' });
        }
    }
    async deletar(req, res) {
        try {
            const { id } = req.params;
            await this.deletarLoja.executar(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao deletar loja' });
        }
    }
}
exports.LojaController = LojaController;
//# sourceMappingURL=LojaController.js.map