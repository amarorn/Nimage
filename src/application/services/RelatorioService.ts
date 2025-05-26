import { AtividadeModel } from '../../infrastructure/database/models/AtividadeModel';
import { LojaModel } from '../../infrastructure/database/models/LojaModel';
import { MontadoraModel } from '../../infrastructure/database/models/MontadoraModel';
import { EquipeModel } from '../../infrastructure/database/models/EquipeModel';
import { VendedorModel } from '../../infrastructure/database/models/VendedorModel';

export class RelatorioService {
    async atividadesPorMontadora() {
        // Agrega atividades por montadora
        return AtividadeModel.aggregate([
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
        return AtividadeModel.aggregate([
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
        return AtividadeModel.aggregate([
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
        return AtividadeModel.aggregate([
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

    async relatorioDocinhosCoco() {
        // Soma total
        const total = await AtividadeModel.aggregate([
            { $group: { _id: null, somaDocinhos: { $sum: "$docinhosCoco" } } }
        ]);

        // Por vendedor
        const porVendedor = await AtividadeModel.aggregate([
            { $group: { _id: "$vendedorId", somaDocinhos: { $sum: "$docinhosCoco" } } }
        ]);

        // Por equipe
        const porEquipe = await AtividadeModel.aggregate([
            {
                $lookup: {
                    from: "vendedors",
                    localField: "vendedorId",
                    foreignField: "id",
                    as: "vendedor"
                }
            },
            { $unwind: "$vendedor" },
            { $group: { _id: "$vendedor.equipeId", somaDocinhos: { $sum: "$docinhosCoco" } } }
        ]);

        // Por loja
        const porLoja = await AtividadeModel.aggregate([
            {
                $lookup: {
                    from: "vendedors",
                    localField: "vendedorId",
                    foreignField: "id",
                    as: "vendedor"
                }
            },
            { $unwind: "$vendedor" },
            {
                $lookup: {
                    from: "equipes",
                    localField: "vendedor.equipeId",
                    foreignField: "id",
                    as: "equipe"
                }
            },
            { $unwind: "$equipe" },
            { $group: { _id: "$equipe.lojaId", somaDocinhos: { $sum: "$docinhosCoco" } } }
        ]);

        // Por montadora
        const porMontadora = await AtividadeModel.aggregate([
            {
                $lookup: {
                    from: "vendedors",
                    localField: "vendedorId",
                    foreignField: "id",
                    as: "vendedor"
                }
            },
            { $unwind: "$vendedor" },
            {
                $lookup: {
                    from: "equipes",
                    localField: "vendedor.equipeId",
                    foreignField: "id",
                    as: "equipe"
                }
            },
            { $unwind: "$equipe" },
            {
                $lookup: {
                    from: "lojas",
                    localField: "equipe.lojaId",
                    foreignField: "id",
                    as: "loja"
                }
            },
            { $unwind: "$loja" },
            { $group: { _id: "$loja.montadoraId", somaDocinhos: { $sum: "$docinhosCoco" } } }
        ]);

        return {
            total: total[0]?.somaDocinhos || 0,
            porVendedor,
            porEquipe,
            porLoja,
            porMontadora
        };
    }
} 