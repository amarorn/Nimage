"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarMontadora = void 0;
class AtualizarMontadora {
    constructor(montadoraRepo) {
        this.montadoraRepo = montadoraRepo;
    }
    async executar(id, dados) {
        if (!id)
            throw new Error('ID da montadora é obrigatório');
        return await this.montadoraRepo.atualizar(id, dados);
    }
}
exports.AtualizarMontadora = AtualizarMontadora;
//# sourceMappingURL=AtualizarMontadora.js.map