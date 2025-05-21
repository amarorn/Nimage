"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaRepositoryImpl = void 0;
const Meta_1 = require("../../domain/entities/Meta");
const MetaModel_1 = require("../database/models/MetaModel");
const MongoDB_1 = require("../database/MongoDB");
class MetaRepositoryImpl {
    constructor() {
        this.metas = [];
    }
    async criar(meta) {
        await MongoDB_1.MongoDB.trackOperation('create', 'metas', async () => {
            await MetaModel_1.MetaModel.create(meta);
        });
    }
    async obterPorEquipe(equipeId) {
        return MongoDB_1.MongoDB.trackOperation('findOne', 'metas', async () => {
            const meta = await MetaModel_1.MetaModel.findOne({ equipeId: equipeId });
            console.log('Meta encontrada:', meta);
            return meta ? this.toDomain(meta) : null;
        });
    }
    async obterPorId(id) {
        return MongoDB_1.MongoDB.trackOperation('findById', 'metas', async () => {
            return await MetaModel_1.MetaModel.findById(id);
        });
    }
    async obterPorEquipeEData(equipeId, dataInicio, dataFim) {
        return MongoDB_1.MongoDB.trackOperation('findOne', 'metas', async () => {
            console.log('Buscando meta por equipe e data:', { equipeId, dataInicio, dataFim });
            const meta = await MetaModel_1.MetaModel.findOne({
                equipeId: equipeId,
                data: { $gte: dataInicio, $lte: dataFim }
            });
            console.log('Meta encontrada:', meta);
            return meta ? this.toDomain(meta) : null;
        });
    }
    async obterTodos(skip, limit) {
        return MongoDB_1.MongoDB.trackOperation('find', 'metas', async () => {
            return await MetaModel_1.MetaModel.find().skip(skip).limit(limit);
        });
    }
    async atualizar(id, dados) {
        return MongoDB_1.MongoDB.trackOperation('findByIdAndUpdate', 'metas', async () => {
            const metaAtualizada = await MetaModel_1.MetaModel.findByIdAndUpdate(id, dados, { new: true });
            if (metaAtualizada) {
                return new Meta_1.Meta(metaAtualizada.id, metaAtualizada.equipeId, metaAtualizada.objetivo, metaAtualizada.data);
            }
            return null;
        });
    }
    async deletar(id) {
        await MongoDB_1.MongoDB.trackOperation('findByIdAndDelete', 'metas', async () => {
            await MetaModel_1.MetaModel.findByIdAndDelete(id);
        });
    }
    async deletarTodos() {
        await MongoDB_1.MongoDB.trackOperation('deleteMany', 'metas', async () => {
            await MetaModel_1.MetaModel.deleteMany({});
        });
    }
    toDomain(meta) {
        return new Meta_1.Meta(meta.id || meta._id.toString(), meta.equipeId, meta.objetivo, meta.data);
    }
}
exports.MetaRepositoryImpl = MetaRepositoryImpl;
//# sourceMappingURL=MetaRepositoryImpl.js.map