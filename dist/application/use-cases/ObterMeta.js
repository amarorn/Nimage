"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterMeta = void 0;
class ObterMeta {
    constructor(metaRepo) {
        this.metaRepo = metaRepo;
    }
    async executar(skip, limit) {
        return await this.metaRepo.obterTodos(skip, limit);
    }
    async executarPorId(id) {
        return await this.metaRepo.obterPorId(id);
    }
    async executarPorEquipe(equipeId) {
        return await this.metaRepo.obterPorEquipe(equipeId);
    }
}
exports.ObterMeta = ObterMeta;
//# sourceMappingURL=ObterMeta.js.map