"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterCategoria = void 0;
class ObterCategoria {
    constructor(categoriaRepo) {
        this.categoriaRepo = categoriaRepo;
    }
    async executar(skip, limit) {
        const [categorias, total] = await Promise.all([
            this.categoriaRepo.obterTodos(skip, limit),
            this.categoriaRepo.obterTotal()
        ]);
        return { categorias, total };
    }
    async executarPorId(id) {
        return await this.categoriaRepo.obterPorId(id);
    }
}
exports.ObterCategoria = ObterCategoria;
//# sourceMappingURL=ObterCategoria.js.map