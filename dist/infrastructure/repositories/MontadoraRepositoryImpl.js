"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MontadoraRepositoryImpl = void 0;
const MontadoraModel_1 = require("../database/models/MontadoraModel");
const MongoDB_1 = require("../database/MongoDB");
class MontadoraRepositoryImpl {
    async criar(montadora) {
        await MongoDB_1.MongoDB.trackOperation('criar', 'montadoras', async () => {
            await MontadoraModel_1.MontadoraModel.create(montadora);
        });
        return montadora;
    }
    async atualizar(id, dados) {
        return await MongoDB_1.MongoDB.trackOperation('atualizar', 'montadoras', async () => {
            const atualizado = await MontadoraModel_1.MontadoraModel.findOneAndUpdate({ id }, { $set: dados }, { new: true });
            return atualizado ? atualizado : null;
        });
    }
    async obterPorId(id) {
        return await MongoDB_1.MongoDB.trackOperation('obterPorId', 'montadoras', async () => {
            return await MontadoraModel_1.MontadoraModel.findOne({ id });
        });
    }
    async obterTodos(skip, limit) {
        return await MongoDB_1.MongoDB.trackOperation('obterTodos', 'montadoras', async () => {
            return await MontadoraModel_1.MontadoraModel.find().skip(skip).limit(limit);
        });
    }
    async deletar(id) {
        await MongoDB_1.MongoDB.trackOperation('deletar', 'montadoras', async () => {
            await MontadoraModel_1.MontadoraModel.deleteOne({ id });
        });
    }
}
exports.MontadoraRepositoryImpl = MontadoraRepositoryImpl;
//# sourceMappingURL=MontadoraRepositoryImpl.js.map