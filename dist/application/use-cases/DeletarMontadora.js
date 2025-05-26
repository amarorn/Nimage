"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletarMontadora = void 0;
class DeletarMontadora {
    constructor(montadoraRepo) {
        this.montadoraRepo = montadoraRepo;
    }
    async executar(id) {
        if (!id)
            throw new Error('ID da montadora é obrigatório');
        await this.montadoraRepo.deletar(id);
    }
}
exports.DeletarMontadora = DeletarMontadora;
//# sourceMappingURL=DeletarMontadora.js.map