"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletarLoja = void 0;
class DeletarLoja {
    constructor(lojaRepo) {
        this.lojaRepo = lojaRepo;
    }
    async executar(id) {
        if (!id) {
            throw new Error('ID da loja é obrigatório');
        }
        const loja = await this.lojaRepo.obterPorId(id);
        if (!loja) {
            throw new Error('Loja não encontrada');
        }
        await this.lojaRepo.deletar(id);
    }
}
exports.DeletarLoja = DeletarLoja;
//# sourceMappingURL=DeletarLoja.js.map