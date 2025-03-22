"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtividadeRepositoryImpl = void 0;
const Atividade_1 = require("../../domain/entities/Atividade");
const AtividadeModel_1 = require("../database/models/AtividadeModel");
class AtividadeRepositoryImpl {
    async criar(atividade) {
        await AtividadeModel_1.AtividadeModel.create(atividade);
    }
    async obterPorId(id) {
        return await AtividadeModel_1.AtividadeModel.findOne({ id }).lean();
    }
    async obterTodos(skip, limit) {
        return await AtividadeModel_1.AtividadeModel.find().skip(skip).limit(limit).lean();
    }
    async obterPorVendedorId(vendedorId) {
        return await AtividadeModel_1.AtividadeModel.find({ vendedorId }).lean();
    }
    async atualizar(id, dados) {
        const atividadeAtualizada = await AtividadeModel_1.AtividadeModel.findOneAndUpdate({ id }, { vendedorId: dados.vendedorId, data: dados.data, docinhosCoco: dados.docinhosCoco }, { new: true }).lean();
        if (atividadeAtualizada) {
            return new Atividade_1.Atividade(atividadeAtualizada.id, atividadeAtualizada.vendedorId, atividadeAtualizada.data, atividadeAtualizada.docinhosCoco);
        }
        return null;
    }
    async obterPorVendedorEData(vendedorId, dataInicio, dataFim) {
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
        return resultado;
    }
    async deletar(id) {
        await AtividadeModel_1.AtividadeModel.findByIdAndDelete(id);
    }
    async deletarTodos() {
        await AtividadeModel_1.AtividadeModel.deleteMany({});
    }
}
exports.AtividadeRepositoryImpl = AtividadeRepositoryImpl;
//# sourceMappingURL=AtividadeRepositoryImpl.js.map