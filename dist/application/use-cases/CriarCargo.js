"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarCargo = void 0;
const Cargo_1 = require("../../domain/entities/Cargo");
class CriarCargo {
    constructor(cargoRepo) {
        this.cargoRepo = cargoRepo;
    }
    async executar(dados) {
        if (!dados.id || !dados.nome || !dados.descricao || !dados.tag) {
            throw new Error('Dados inválidos para criar cargo');
        }
        const cargo = new Cargo_1.Cargo(dados.id, dados.nome, dados.descricao, dados.tag);
        await this.cargoRepo.criar(cargo);
        return cargo;
    }
}
exports.CriarCargo = CriarCargo;
//# sourceMappingURL=CriarCargo.js.map