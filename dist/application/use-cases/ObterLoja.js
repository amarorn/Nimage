"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterLoja = void 0;
class ObterLoja {
    constructor(lojaRepo) {
        this.lojaRepo = lojaRepo;
    }
    async executar(skip, limit) {
        const [lojas, total] = await Promise.all([
            this.lojaRepo.obterTodos(skip, limit),
            this.lojaRepo.obterTotal()
        ]);
        return { lojas, total };
    }
    async executarPorId(id) {
        return await this.lojaRepo.obterPorId(id);
    }
}
exports.ObterLoja = ObterLoja;
//# sourceMappingURL=ObterLoja.js.map