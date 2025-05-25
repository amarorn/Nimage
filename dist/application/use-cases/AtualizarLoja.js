"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarLoja = void 0;
class AtualizarLoja {
    constructor(lojaRepo) {
        this.lojaRepo = lojaRepo;
    }
    async executar(id, dados) {
        if (!id) {
            throw new Error('ID da loja é obrigatório');
        }
        // Verifica se a loja existe
        const lojaExistente = await this.lojaRepo.obterPorId(id);
        if (!lojaExistente) {
            throw new Error('Loja não encontrada');
        }
        return await this.lojaRepo.atualizar(id, dados);
    }
}
exports.AtualizarLoja = AtualizarLoja;
//# sourceMappingURL=AtualizarLoja.js.map