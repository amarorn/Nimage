"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtividadeRepositoryImpl = void 0;
const Atividade_1 = require("../../domain/entities/Atividade");
const AtividadeModel_1 = require("../database/models/AtividadeModel");
const MongoDB_1 = require("../database/MongoDB");
class AtividadeRepositoryImpl {
    async criar(atividade) {
        await MongoDB_1.MongoDB.trackOperation('create', 'atividades', async () => {
            await AtividadeModel_1.AtividadeModel.create(atividade);
        });
    }
    async obterPorId(id) {
        return MongoDB_1.MongoDB.trackOperation('findById', 'atividades', async () => {
            const atividade = await AtividadeModel_1.AtividadeModel.findById(id).lean();
            if (atividade) {
                return new Atividade_1.Atividade(atividade.id, atividade.vendedorId, atividade.data, atividade.docinhosCoco, atividade.follow_up, atividade.total_docinhos);
            }
            return null;
        });
    }
    async obterTodos(skip, limit) {
        return MongoDB_1.MongoDB.trackOperation('find', 'atividades', async () => {
            const atividades = await AtividadeModel_1.AtividadeModel.find().skip(skip).limit(limit).lean();
            return atividades.map(atividade => new Atividade_1.Atividade(atividade.id, atividade.vendedorId, atividade.data, atividade.docinhosCoco, atividade.follow_up, atividade.total_docinhos));
        });
    }
    async obterTotal() {
        return MongoDB_1.MongoDB.trackOperation('countDocuments', 'atividades', async () => {
            return await AtividadeModel_1.AtividadeModel.countDocuments();
        });
    }
    async obterPorVendedorId(vendedorId) {
        return MongoDB_1.MongoDB.trackOperation('find', 'atividades', async () => {
            const atividades = await AtividadeModel_1.AtividadeModel.find({ vendedorId }).lean();
            return atividades.map(atividade => new Atividade_1.Atividade(atividade.id, atividade.vendedorId, atividade.data, atividade.docinhosCoco, atividade.follow_up, atividade.total_docinhos));
        });
    }
    async atualizar(id, dados) {
        return MongoDB_1.MongoDB.trackOperation('findByIdAndUpdate', 'atividades', async () => {
            const atividadeAtualizada = await AtividadeModel_1.AtividadeModel.findByIdAndUpdate(id, dados, { new: true }).lean();
            if (atividadeAtualizada) {
                return new Atividade_1.Atividade(atividadeAtualizada.id, atividadeAtualizada.vendedorId, atividadeAtualizada.data, atividadeAtualizada.docinhosCoco, atividadeAtualizada.follow_up, atividadeAtualizada.total_docinhos);
            }
            return null;
        });
    }
    async obterPorVendedorEData(vendedorId, dataInicio, dataFim) {
        return MongoDB_1.MongoDB.trackOperation('find', 'atividades', async () => {
            console.log('Debug - Repository - Query params:', {
                vendedorId,
                dataInicio,
                dataFim
            });
            const query = {
                vendedorId,
                data: {
                    $gte: dataInicio.setHours(0, 0, 0, 0),
                    $lte: dataFim.setHours(23, 59, 59, 999)
                }
            };
            console.log('Debug - Repository - MongoDB query:', query);
            const resultado = await AtividadeModel_1.AtividadeModel.find(query).lean();
            console.log('Debug - Repository - Resultado encontrado:', resultado);
            return resultado.map(atividade => new Atividade_1.Atividade(atividade.id, atividade.vendedorId, atividade.data, atividade.docinhosCoco, atividade.follow_up, atividade.total_docinhos));
        });
    }
    async deletar(id) {
        await MongoDB_1.MongoDB.trackOperation('findByIdAndDelete', 'atividades', async () => {
            await AtividadeModel_1.AtividadeModel.findByIdAndDelete(id);
        });
    }
    async deletarTodos() {
        await MongoDB_1.MongoDB.trackOperation('deleteMany', 'atividades', async () => {
            await AtividadeModel_1.AtividadeModel.deleteMany({});
        });
    }
}
exports.AtividadeRepositoryImpl = AtividadeRepositoryImpl;
//# sourceMappingURL=AtividadeRepositoryImpl.js.map