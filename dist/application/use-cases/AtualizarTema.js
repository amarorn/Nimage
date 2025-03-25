"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarTema = void 0;
class AtualizarTema {
    constructor(temaRepo) {
        this.temaRepo = temaRepo;
    }
    async executar(id, dados) {
        if (!dados.nome || !dados.descricao || !dados.cor) {
            throw new Error('Dados inválidos para atualizar tema');
        }
        return await this.temaRepo.atualizar(id, dados);
    }
}
exports.AtualizarTema = AtualizarTema;
//# sourceMappingURL=AtualizarTema.js.map