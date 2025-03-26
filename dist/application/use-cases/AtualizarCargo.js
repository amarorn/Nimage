"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarCargo = void 0;
class AtualizarCargo {
    constructor(cargoRepo) {
        this.cargoRepo = cargoRepo;
    }
    async executar(id, dados) {
        if (!dados.nome || !dados.descricao || !dados.tag) {
            throw new Error('Dados inválidos para atualizar cargo');
        }
        return await this.cargoRepo.atualizar(id, dados);
    }
}
exports.AtualizarCargo = AtualizarCargo;
//# sourceMappingURL=AtualizarCargo.js.map