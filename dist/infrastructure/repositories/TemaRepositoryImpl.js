"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemaRepositoryImpl = void 0;
const Tema_1 = require("../../domain/entities/Tema");
const TemaModel_1 = require("../database/models/TemaModel");
class TemaRepositoryImpl {
    async criar(tema) {
        await TemaModel_1.TemaModel.create(tema);
    }
    async atualizar(id, dados) {
        const temaAtualizado = await TemaModel_1.TemaModel.findOneAndUpdate({ id }, Object.assign({}, dados), { new: true }).lean();
        if (temaAtualizado) {
            return new Tema_1.Tema(temaAtualizado.id, temaAtualizado.nome, temaAtualizado.descricao, temaAtualizado.cor);
        }
        return null;
    }
    async obterPorId(id) {
        const tema = await TemaModel_1.TemaModel.findOne({ id }).lean();
        if (!tema)
            return null;
        return new Tema_1.Tema(tema.id, tema.nome, tema.descricao, tema.cor);
    }
    async obterTodos(skip, limit) {
        const temas = await TemaModel_1.TemaModel.find()
            .skip(skip)
            .limit(limit)
            .lean();
        return temas.map(tema => new Tema_1.Tema(tema.id, tema.nome, tema.descricao, tema.cor));
    }
    async deletar(id) {
        await TemaModel_1.TemaModel.deleteOne({ id });
    }
    async obterTotal() {
        return await TemaModel_1.TemaModel.countDocuments();
    }
}
exports.TemaRepositoryImpl = TemaRepositoryImpl;
//# sourceMappingURL=TemaRepositoryImpl.js.map