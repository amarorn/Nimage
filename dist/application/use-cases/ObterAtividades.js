"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterAtividades = void 0;
class ObterAtividades {
    constructor(atividadeRepo) {
        this.atividadeRepo = atividadeRepo;
    }
    async executar(skip, limit) {
        //console.log("Executando ObterAtividades com paginação", { skip, limit });
        return await this.atividadeRepo.obterTodos(skip, limit);
    }
    async executarPorId(id) {
        //console.log("Executando ObterAtividades por ID", { id });
        return await this.atividadeRepo.obterPorId(id);
    }
}
exports.ObterAtividades = ObterAtividades;
//# sourceMappingURL=ObterAtividades.js.map