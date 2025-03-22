"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeRepositoryImpl = void 0;
const Equipe_1 = require("../../domain/entities/Equipe");
const EquipeModel_1 = require("../database/models/EquipeModel");
class EquipeRepositoryImpl {
    async criar(equipe) {
        await EquipeModel_1.EquipeModel.create(equipe);
    }
    async obterPorId(id) {
        const equipe = await EquipeModel_1.EquipeModel.findOne({ id }).lean();
        if (equipe) {
            return new Equipe_1.Equipe(equipe.id, equipe.nome, equipe.nomepdv, equipe.cidade, equipe.estado, equipe.gerente, equipe.contato_gerente, equipe.capitao, equipe.contato_capitao);
        }
        return null;
    }
    async obterTodos(skip, limit) {
        const equipes = await EquipeModel_1.EquipeModel.find().skip(skip).limit(limit).lean();
        return equipes.map(equipe => new Equipe_1.Equipe(equipe.id, equipe.nome, equipe.nomepdv, equipe.cidade, equipe.estado, equipe.gerente, equipe.contato_gerente, equipe.capitao, equipe.contato_capitao));
    }
    async atualizar(id, dados) {
        const equipeAtualizada = await EquipeModel_1.EquipeModel.findOneAndUpdate({ id }, { $set: dados }, { new: true }).lean();
        if (equipeAtualizada) {
            return new Equipe_1.Equipe(equipeAtualizada.id, equipeAtualizada.nome, equipeAtualizada.nomepdv, equipeAtualizada.cidade, equipeAtualizada.estado, equipeAtualizada.gerente, equipeAtualizada.contato_gerente, equipeAtualizada.capitao, equipeAtualizada.contato_capitao);
        }
        return null;
    }
    async deletar(id) {
        await EquipeModel_1.EquipeModel.deleteOne({ id });
    }
    async deletarTodos() {
        await EquipeModel_1.EquipeModel.deleteMany({});
    }
}
exports.EquipeRepositoryImpl = EquipeRepositoryImpl;
//# sourceMappingURL=EquipeRepositoryImpl.js.map