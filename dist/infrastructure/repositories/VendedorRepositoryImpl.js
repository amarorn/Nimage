"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendedorRepositoryImpl = void 0;
const Vendedor_1 = require("../../domain/entities/Vendedor");
const VendedorModel_1 = require("../database/models/VendedorModel");
const EquipeModel_1 = require("../database/models/EquipeModel");
const MongoDB_1 = require("../database/MongoDB");
class VendedorRepositoryImpl {
    async criar(vendedor) {
        await MongoDB_1.MongoDB.trackOperation('create', 'vendedores', async () => {
            await VendedorModel_1.VendedorModel.create(vendedor);
        });
    }
    async obterPorId(id) {
        return MongoDB_1.MongoDB.trackOperation('findOne', 'vendedores', async () => {
            console.log('Debug - Repository - Buscando vendedor no banco com ID:', id);
            const vendedor = await VendedorModel_1.VendedorModel.findOne({ id }).lean();
            console.log('Debug - Repository - Resultado da busca no banco:', vendedor);
            if (vendedor) {
                console.log('Debug - Repository - Vendedor encontrado, buscando equipe com ID:', vendedor.equipeId);
                const equipe = await EquipeModel_1.EquipeModel.findOne({ id: vendedor.equipeId }).lean();
                console.log('Debug - Repository - Resultado da busca da equipe:', equipe);
                return new Vendedor_1.Vendedor(vendedor.id, vendedor.nome, vendedor.equipeId, vendedor.email, vendedor.telefone, vendedor.meta, vendedor.cargo);
            }
            return null;
        });
    }
    async obterTodos(skip, limit) {
        return MongoDB_1.MongoDB.trackOperation('find', 'vendedores', async () => {
            const vendedores = await VendedorModel_1.VendedorModel.find().skip(skip).limit(limit).lean();
            return vendedores.map(vendedor => new Vendedor_1.Vendedor(vendedor.id, vendedor.nome, vendedor.equipeId, vendedor.email, vendedor.telefone, vendedor.meta, vendedor.cargo));
        });
    }
    async obterPorEquipeId(equipeId) {
        return MongoDB_1.MongoDB.trackOperation('find', 'vendedores', async () => {
            const vendedores = await VendedorModel_1.VendedorModel.find({ equipeId }).lean();
            return vendedores.map(vendedor => new Vendedor_1.Vendedor(vendedor.id, vendedor.nome, vendedor.equipeId, vendedor.email, vendedor.telefone, vendedor.meta, vendedor.cargo));
        });
    }
    async atualizar(id, dados) {
        return MongoDB_1.MongoDB.trackOperation('update', 'vendedores', async () => {
            const vendedorAtualizado = await VendedorModel_1.VendedorModel.findOneAndUpdate({ id }, { $set: dados }, { new: true }).lean();
            if (vendedorAtualizado) {
                return new Vendedor_1.Vendedor(vendedorAtualizado.id, vendedorAtualizado.nome, vendedorAtualizado.equipeId, vendedorAtualizado.email, vendedorAtualizado.telefone, vendedorAtualizado.meta, vendedorAtualizado.cargo);
            }
            return null;
        });
    }
    async deletar(id) {
        await MongoDB_1.MongoDB.trackOperation('delete', 'vendedores', async () => {
            await VendedorModel_1.VendedorModel.deleteOne({ id });
        });
    }
    async deletarTodos() {
        await MongoDB_1.MongoDB.trackOperation('deleteMany', 'vendedores', async () => {
            await VendedorModel_1.VendedorModel.deleteMany({});
        });
    }
}
exports.VendedorRepositoryImpl = VendedorRepositoryImpl;
//# sourceMappingURL=VendedorRepositoryImpl.js.map