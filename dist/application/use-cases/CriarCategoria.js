"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarCategoria = void 0;
const Categoria_1 = require("../../domain/entities/Categoria");
class CriarCategoria {
    constructor(categoriaRepo) {
        this.categoriaRepo = categoriaRepo;
    }
    async executar(dados) {
        if (!dados.id || !dados.nome || !dados.descricao || !dados.icone || dados.ativo === undefined) {
            throw new Error('Dados inválidos para criar categoria');
        }
        const categoria = new Categoria_1.Categoria(dados.id, dados.nome, dados.descricao, dados.icone, dados.ativo);
        await this.categoriaRepo.criar(categoria);
        return categoria;
    }
}
exports.CriarCategoria = CriarCategoria;
//# sourceMappingURL=CriarCategoria.js.map