"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarMontadora = void 0;
const Montadora_1 = require("../../domain/entities/Montadora");
class CriarMontadora {
    constructor(montadoraRepo) {
        this.montadoraRepo = montadoraRepo;
    }
    async executar(dados) {
        if (!dados.id || !dados.razaoSocial || !dados.nomeFantasia || !dados.cnpj || !dados.telefoneFixo) {
            throw new Error('Dados obrigatórios ausentes');
        }
        const montadora = new Montadora_1.Montadora(dados.id, dados.razaoSocial, dados.nomeFantasia, dados.cnpj, dados.telefoneFixo);
        return await this.montadoraRepo.criar(montadora);
    }
}
exports.CriarMontadora = CriarMontadora;
//# sourceMappingURL=CriarMontadora.js.map