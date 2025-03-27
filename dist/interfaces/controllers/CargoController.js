"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargoController = void 0;
class CargoController {
    constructor(criarCargo, obterCargo, atualizarCargo, cargoRepo) {
        this.criarCargo = criarCargo;
        this.obterCargo = obterCargo;
        this.atualizarCargo = atualizarCargo;
        this.cargoRepo = cargoRepo;
    }
    async criar(req, res) {
        try {
            const { id, nome, descricao, tag } = req.body;
            if (!id || !nome || !descricao || !tag) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        nome: nome ? 'presente' : 'ausente',
                        descricao: descricao ? 'presente' : 'ausente',
                        tag: tag ? 'presente' : 'ausente'
                    }
                });
            }
            const cargo = await this.criarCargo.executar({ id, nome, descricao, tag });
            return res.status(201).json(cargo);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao criar cargo',
                mensagem: erro.message
            });
        }
    }
    async obterTodos(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const { cargos, total } = await this.obterCargo.executar(skip, limit);
            return res.status(200).json({
                pagina: page,
                limite: limit,
                total,
                totalPaginas: Math.ceil(total / limit),
                cargos
            });
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter cargos',
                mensagem: erro.message
            });
        }
    }
    async obterPorId(req, res) {
        try {
            const { id } = req.params;
            const cargo = await this.obterCargo.executarPorId(id);
            if (!cargo) {
                return res.status(404).json({ erro: 'Cargo não encontrado' });
            }
            return res.status(200).json(cargo);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter cargo',
                mensagem: erro.message
            });
        }
    }
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, descricao, tag } = req.body;
            if (!nome || !descricao || !tag) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        nome: nome ? 'presente' : 'ausente',
                        descricao: descricao ? 'presente' : 'ausente',
                        tag: tag ? 'presente' : 'ausente'
                    }
                });
            }
            const cargoAtualizado = await this.atualizarCargo.executar(id, { nome, descricao, tag });
            if (!cargoAtualizado) {
                return res.status(404).json({ erro: 'Cargo não encontrado' });
            }
            return res.status(200).json(cargoAtualizado);
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao atualizar cargo',
                mensagem: erro.message
            });
        }
    }
    async deletar(req, res) {
        try {
            const { id } = req.params;
            await this.cargoRepo.deletar(id);
            return res.status(204).send();
        }
        catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao deletar cargo',
                mensagem: erro.message
            });
        }
    }
}
exports.CargoController = CargoController;
//# sourceMappingURL=CargoController.js.map