"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterTema = void 0;
class ObterTema {
    constructor(temaRepo) {
        this.temaRepo = temaRepo;
    }
    async executar(skip, limit) {
        const [temas, total] = await Promise.all([
            this.temaRepo.obterTodos(skip, limit),
            this.temaRepo.obterTotal()
        ]);
        return { temas, total };
    }
    async executarPorId(id) {
        return await this.temaRepo.obterPorId(id);
    }
}
exports.ObterTema = ObterTema;
//# sourceMappingURL=ObterTema.js.map