"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaRepositoryImpl = void 0;
const Categoria_1 = require("../../domain/entities/Categoria");
const CategoriaModel_1 = require("../database/models/CategoriaModel");
class CategoriaRepositoryImpl {
    async criar(categoria) {
        await CategoriaModel_1.CategoriaModel.create(categoria);
    }
    async atualizar(id, dados) {
        const categoriaAtualizada = await CategoriaModel_1.CategoriaModel.findOneAndUpdate({ id }, Object.assign({}, dados), { new: true }).lean();
        if (categoriaAtualizada) {
            return new Categoria_1.Categoria(categoriaAtualizada.id, categoriaAtualizada.nome, categoriaAtualizada.descricao, categoriaAtualizada.icone, categoriaAtualizada.ativo);
        }
        return null;
    }
    async obterPorId(id) {
        const categoria = await CategoriaModel_1.CategoriaModel.findOne({ id }).lean();
        if (!categoria)
            return null;
        return new Categoria_1.Categoria(categoria.id, categoria.nome, categoria.descricao, categoria.icone, categoria.ativo);
    }
    async obterTodos(skip, limit) {
        const categorias = await CategoriaModel_1.CategoriaModel.find()
            .skip(skip)
            .limit(limit)
            .lean();
        return categorias.map(categoria => new Categoria_1.Categoria(categoria.id, categoria.nome, categoria.descricao, categoria.icone, categoria.ativo));
    }
    async deletar(id) {
        await CategoriaModel_1.CategoriaModel.deleteOne({ id });
    }
    async obterTotal() {
        return await CategoriaModel_1.CategoriaModel.countDocuments();
    }
}
exports.CategoriaRepositoryImpl = CategoriaRepositoryImpl;
//# sourceMappingURL=CategoriaRepositoryImpl.js.map