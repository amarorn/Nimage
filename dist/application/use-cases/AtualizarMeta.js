"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarMeta = void 0;
class AtualizarMeta {
    constructor(metaRepo) {
        this.metaRepo = metaRepo;
    }
    async executar(id, dados) {
        //console.log("📝 Iniciando atualização de meta com dados:", dados);
        if (!dados.equipeId || dados.objetivo === undefined || !dados.data) {
            throw new Error('Dados inválidos para atualizar meta');
        }
        if (dados.objetivo < 0) {
            throw new Error('Objetivo não pode ser negativo');
        }
        const metaAtualizada = await this.metaRepo.atualizar(id, dados);
        //console.log("💾 Meta atualizada no banco:", metaAtualizada);
        return metaAtualizada;
    }
}
exports.AtualizarMeta = AtualizarMeta;
//# sourceMappingURL=AtualizarMeta.js.map