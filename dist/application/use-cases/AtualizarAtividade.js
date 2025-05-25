"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarAtividade = void 0;
class AtualizarAtividade {
    constructor(atividadeRepo) {
        this.atividadeRepo = atividadeRepo;
    }
    async executar(id, dados) {
        //console.log("📝 Iniciando atualização de atividade com dados:", dados);
        if (!dados.vendedorId || !dados.data || dados.docinhosCoco === undefined || dados.follow_up === undefined || !dados.clienteId) {
            throw new Error('Dados inválidos para atualizar atividade');
        }
        const atividadeAtualizada = await this.atividadeRepo.atualizar(id, dados);
        //console.log("💾 Atividade atualizada no banco:", atividadeAtualizada);
        return atividadeAtualizada;
    }
}
exports.AtualizarAtividade = AtualizarAtividade;
//# sourceMappingURL=AtualizarAtividade.js.map