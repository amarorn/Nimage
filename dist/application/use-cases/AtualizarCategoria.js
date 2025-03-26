"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarCategoria = void 0;
class AtualizarCategoria {
    constructor(categoriaRepo) {
        this.categoriaRepo = categoriaRepo;
    }
    async executar(id, dados) {
        if (!dados.nome || !dados.descricao || !dados.icone || dados.ativo === undefined) {
            throw new Error('Dados inválidos para atualizar categoria');
        }
        return await this.categoriaRepo.atualizar(id, dados);
    }
}
exports.AtualizarCategoria = AtualizarCategoria;
//# sourceMappingURL=AtualizarCategoria.js.map