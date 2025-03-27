"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterCargo = void 0;
class ObterCargo {
    constructor(cargoRepo) {
        this.cargoRepo = cargoRepo;
    }
    async executar(skip, limit) {
        const [cargos, total] = await Promise.all([
            this.cargoRepo.obterTodos(skip, limit),
            this.cargoRepo.obterTotal()
        ]);
        return { cargos, total };
    }
    async executarPorId(id) {
        return await this.cargoRepo.obterPorId(id);
    }
}
exports.ObterCargo = ObterCargo;
//# sourceMappingURL=ObterCargo.js.map