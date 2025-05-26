"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarTema = void 0;
const Tema_1 = require("../../domain/entities/Tema");
const uuid_1 = require("uuid");
class CriarTema {
    constructor(temaRepo) {
        this.temaRepo = temaRepo;
    }
    async executar(dados) {
        if (!dados.nome || !dados.descricao || !dados.cor) {
            throw new Error('Dados inválidos para criar tema');
        }
        const tema = new Tema_1.Tema((0, uuid_1.v4)(), dados.nome, dados.descricao, dados.cor);
        await this.temaRepo.criar(tema);
        return tema;
    }
}
exports.CriarTema = CriarTema;
//# sourceMappingURL=CriarTema.js.map