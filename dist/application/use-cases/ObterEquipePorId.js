"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterEquipePorId = void 0;
class ObterEquipePorId {
    constructor(equipeRepo) {
        this.equipeRepo = equipeRepo;
    }
    async executar(id) {
        return await this.equipeRepo.obterPorId(id);
    }
}
exports.ObterEquipePorId = ObterEquipePorId;
//# sourceMappingURL=ObterEquipePorId.js.map