"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterMontadora = void 0;
class ObterMontadora {
    constructor(montadoraRepo) {
        this.montadoraRepo = montadoraRepo;
    }
    async executar(skip, limit) {
        return await this.montadoraRepo.obterTodos(skip, limit);
    }
    async executarPorId(id) {
        return await this.montadoraRepo.obterPorId(id);
    }
}
exports.ObterMontadora = ObterMontadora;
//# sourceMappingURL=ObterMontadora.js.map