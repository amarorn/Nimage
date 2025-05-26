"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarLoja = void 0;
const Loja_1 = require("../../domain/entities/Loja");
class CriarLoja {
    constructor(lojaRepo) {
        this.lojaRepo = lojaRepo;
    }
    async executar(dados) {
        if (!dados.id || !dados.nome || !dados.cnpj || !dados.telefone || !dados.montadoraId) {
            throw new Error('Dados inválidos para criar loja');
        }
        const loja = new Loja_1.Loja(dados.id, dados.nome, dados.cnpj, dados.telefone, dados.montadoraId);
        await this.lojaRepo.criar(loja);
        return loja;
    }
}
exports.CriarLoja = CriarLoja;
//# sourceMappingURL=CriarLoja.js.map