"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LojaRepositoryImpl = void 0;
const Loja_1 = require("../../domain/entities/Loja");
const LojaModel_1 = require("../database/models/LojaModel");
const MongoDB_1 = require("../database/MongoDB");
class LojaRepositoryImpl {
    async criar(loja) {
        await MongoDB_1.MongoDB.trackOperation('criar', 'lojas', async () => {
            await LojaModel_1.LojaModel.create({
                id: loja.id,
                nome: loja.nome,
                cnpj: loja.cnpj,
                telefone: loja.telefone,
                montadoraId: loja.montadoraId
            });
        });
    }
    async atualizar(id, dados) {
        const loja = await LojaModel_1.LojaModel.findOneAndUpdate({ id }, { $set: dados }, { new: true });
        if (!loja)
            return null;
        return this.toDomain(loja);
    }
    async obterPorId(id) {
        const loja = await LojaModel_1.LojaModel.findOne({ id });
        if (!loja)
            return null;
        return this.toDomain(loja);
    }
    async obterTodos(skip, limit) {
        const lojas = await LojaModel_1.LojaModel.find().skip(skip).limit(limit);
        return lojas.map(this.toDomain);
    }
    async deletar(id) {
        await LojaModel_1.LojaModel.deleteOne({ id });
    }
    async obterTotal() {
        return LojaModel_1.LojaModel.countDocuments();
    }
    toDomain(loja) {
        return new Loja_1.Loja(loja.id, loja.nome, loja.cnpj, loja.telefone, loja.montadoraId);
    }
}
exports.LojaRepositoryImpl = LojaRepositoryImpl;
//# sourceMappingURL=LojaRepositoryImpl.js.map