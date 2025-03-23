"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterEquipe = void 0;
class ObterEquipe {
    constructor(equipeRepo) {
        this.equipeRepo = equipeRepo;
    }
    async executar(skip, limit) {
        //console.log("Executando ObterEquipe com paginação", { skip, limit });
        return await this.equipeRepo.obterTodos(skip, limit);
    }
    async executarPorId(id) {
        //console.log("Executando ObterEquipe por ID", { id });
        return await this.equipeRepo.obterPorId(id);
    }
}
exports.ObterEquipe = ObterEquipe;
//# sourceMappingURL=ObterEquipe.js.map