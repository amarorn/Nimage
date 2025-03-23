"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaRepositoryImpl = void 0;
const Meta_1 = require("../../domain/entities/Meta");
const MetaModel_1 = require("../database/models/MetaModel");
class MetaRepositoryImpl {
    constructor() {
        this.metas = [];
    }
    async criar(meta) {
        await MetaModel_1.MetaModel.create(meta);
    }
    async obterPorEquipe(equipeId) {
        console.log('Buscando meta por equipe:', equipeId);
        const meta = await MetaModel_1.MetaModel.findOne({ equipeId: equipeId });
        console.log('Meta encontrada:', meta);
        return meta ? this.toDomain(meta) : null;
    }
    async obterPorId(id) {
        return await MetaModel_1.MetaModel.findById(id);
    }
    async obterPorEquipeEData(equipeId, dataInicio, dataFim) {
        console.log('Buscando meta por equipe e data:', { equipeId, dataInicio, dataFim });
        const meta = await MetaModel_1.MetaModel.findOne({
            equipeId: equipeId,
            data: { $gte: dataInicio, $lte: dataFim }
        });
        console.log('Meta encontrada:', meta);
        return meta ? this.toDomain(meta) : null;
    }
    async obterTodos(skip, limit) {
        return await MetaModel_1.MetaModel.find().skip(skip).limit(limit);
    }
    async atualizar(id, dados) {
        const metaAtualizada = await MetaModel_1.MetaModel.findByIdAndUpdate(id, { equipeId: dados.equipeId, objetivo: dados.objetivo, data: dados.data }, { new: true });
        if (metaAtualizada) {
            return new Meta_1.Meta(metaAtualizada.id, metaAtualizada.equipeId, metaAtualizada.objetivo, metaAtualizada.data);
        }
        return null;
    }
    async deletar(id) {
        await MetaModel_1.MetaModel.findByIdAndDelete(id);
    }
    async deletarTodos() {
        await MetaModel_1.MetaModel.deleteMany({});
    }
    toDomain(meta) {
        return new Meta_1.Meta(meta.id || meta._id.toString(), meta.equipeId, meta.objetivo, meta.data);
    }
}
exports.MetaRepositoryImpl = MetaRepositoryImpl;
//# sourceMappingURL=MetaRepositoryImpl.js.map