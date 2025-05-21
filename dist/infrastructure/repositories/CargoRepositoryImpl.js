"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargoRepositoryImpl = void 0;
const Cargo_1 = require("../../domain/entities/Cargo");
const CargoModel_1 = require("../database/models/CargoModel");
const MongoDB_1 = require("../database/MongoDB");
class CargoRepositoryImpl {
    async criar(cargo) {
        await MongoDB_1.MongoDB.trackOperation('create', 'cargos', async () => {
            await CargoModel_1.CargoModel.create(cargo);
        });
    }
    async atualizar(id, dados) {
        return MongoDB_1.MongoDB.trackOperation('findOneAndUpdate', 'cargos', async () => {
            const cargoAtualizado = await CargoModel_1.CargoModel.findOneAndUpdate({ id }, dados, { new: true }).lean();
            if (cargoAtualizado) {
                return new Cargo_1.Cargo(cargoAtualizado.id, cargoAtualizado.nome, cargoAtualizado.descricao, cargoAtualizado.tag);
            }
            return null;
        });
    }
    async obterPorId(id) {
        return MongoDB_1.MongoDB.trackOperation('findOne', 'cargos', async () => {
            const cargo = await CargoModel_1.CargoModel.findOne({ id }).lean();
            if (!cargo)
                return null;
            return new Cargo_1.Cargo(cargo.id, cargo.nome, cargo.descricao, cargo.tag);
        });
    }
    async obterTodos(skip, limit) {
        return MongoDB_1.MongoDB.trackOperation('find', 'cargos', async () => {
            const cargos = await CargoModel_1.CargoModel.find()
                .skip(skip)
                .limit(limit)
                .lean();
            return cargos.map(cargo => new Cargo_1.Cargo(cargo.id, cargo.nome, cargo.descricao, cargo.tag));
        });
    }
    async deletar(id) {
        await MongoDB_1.MongoDB.trackOperation('deleteOne', 'cargos', async () => {
            await CargoModel_1.CargoModel.deleteOne({ id });
        });
    }
    async obterTotal() {
        return MongoDB_1.MongoDB.trackOperation('countDocuments', 'cargos', async () => {
            return await CargoModel_1.CargoModel.countDocuments();
        });
    }
}
exports.CargoRepositoryImpl = CargoRepositoryImpl;
//# sourceMappingURL=CargoRepositoryImpl.js.map