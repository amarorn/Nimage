"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioService = void 0;
const AtividadeModel_1 = require("../../infrastructure/database/models/AtividadeModel");
class RelatorioService {
    async atividadesPorMontadora() {
        // Agrega atividades por montadora
        return AtividadeModel_1.AtividadeModel.aggregate([
            {
                $lookup: {
                    from: 'lojas',
                    localField: 'vendedorId',
                    foreignField: 'vendedorId',
                    as: 'loja'
                }
            },
            {
                $lookup: {
                    from: 'montadoras',
                    localField: 'loja.montadoraId',
                    foreignField: 'id',
                    as: 'montadora'
                }
            },
            { $unwind: '$montadora' },
            {
                $group: {
                    _id: '$montadora.id',
                    nome: { $first: '$montadora.nomeFantasia' },
                    totalAtividades: { $sum: 1 }
                }
            }
        ]);
    }
    async atividadesPorVendedor() {
        return AtividadeModel_1.AtividadeModel.aggregate([
            {
                $group: {
                    _id: '$vendedorId',
                    totalAtividades: { $sum: 1 }
                }
            }
        ]);
    }
    async atividadesPorLoja() {
        // Agrega atividades por loja
        return AtividadeModel_1.AtividadeModel.aggregate([
            {
                $lookup: {
                    from: 'lojas',
                    localField: 'vendedorId',
                    foreignField: 'vendedorId',
                    as: 'loja'
                }
            },
            { $unwind: '$loja' },
            {
                $group: {
                    _id: '$loja.id',
                    nome: { $first: '$loja.nome' },
                    totalAtividades: { $sum: 1 }
                }
            }
        ]);
    }
    async atividadesPorEquipe() {
        // Agrega atividades por equipe
        return AtividadeModel_1.AtividadeModel.aggregate([
            {
                $lookup: {
                    from: 'vendedors',
                    localField: 'vendedorId',
                    foreignField: 'id',
                    as: 'vendedor'
                }
            },
            { $unwind: '$vendedor' },
            {
                $group: {
                    _id: '$vendedor.equipeId',
                    totalAtividades: { $sum: 1 }
                }
            }
        ]);
    }
}
exports.RelatorioService = RelatorioService;
//# sourceMappingURL=RelatorioService.js.map