"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MontadoraController = void 0;
const uuid_1 = require("uuid");
class MontadoraController {
    constructor(criarMontadora, obterMontadora, atualizarMontadora, deletarMontadora) {
        this.criarMontadora = criarMontadora;
        this.obterMontadora = obterMontadora;
        this.atualizarMontadora = atualizarMontadora;
        this.deletarMontadora = deletarMontadora;
    }
    async criar(req, res) {
        try {
            const id = (0, uuid_1.v4)();
            const { razaoSocial, nomeFantasia, cnpj, telefoneFixo } = req.body;
            if (!razaoSocial || !nomeFantasia || !cnpj || !telefoneFixo) {
                return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
            }
            const montadora = await this.criarMontadora.executar({
                id,
                razaoSocial,
                nomeFantasia,
                cnpj,
                telefoneFixo
            });
            res.status(201).json(montadora);
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao criar montadora' });
        }
    }
    async obterTodos(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;
            const skip = (pagina - 1) * limite;
            const montadoras = await this.obterMontadora.executar(skip, limite);
            res.json(montadoras);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter montadoras' });
        }
    }
    async obterPorId(req, res) {
        try {
            const { id } = req.params;
            const montadora = await this.obterMontadora.executarPorId(id);
            if (!montadora) {
                return res.status(404).json({ error: 'Montadora não encontrada' });
            }
            res.json(montadora);
        }
        catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter montadora' });
        }
    }
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dados = req.body;
            const montadoraAtualizada = await this.atualizarMontadora.executar(id, dados);
            if (!montadoraAtualizada) {
                return res.status(404).json({ error: 'Montadora não encontrada' });
            }
            res.json(montadoraAtualizada);
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao atualizar montadora' });
        }
    }
    async deletar(req, res) {
        try {
            const { id } = req.params;
            await this.deletarMontadora.executar(id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao deletar montadora' });
        }
    }
}
exports.MontadoraController = MontadoraController;
//# sourceMappingURL=MontadoraController.js.map