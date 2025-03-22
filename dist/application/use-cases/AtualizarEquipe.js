"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarEquipe = void 0;
class AtualizarEquipe {
    constructor(equipeRepo) {
        this.equipeRepo = equipeRepo;
    }
    async executar(id, dados) {
        if (!id) {
            throw new Error('ID da equipe não fornecido');
        }
        // Verifica se a equipe existe
        const equipeExistente = await this.equipeRepo.obterPorId(id);
        if (!equipeExistente) {
            throw new Error('Equipe não encontrada');
        }
        // Valida os campos fornecidos
        if (dados.nome && dados.nome.trim().length === 0) {
            throw new Error('Nome da equipe não pode estar vazio');
        }
        // Atualiza a equipe
        const equipeAtualizada = await this.equipeRepo.atualizar(id, dados);
        if (!equipeAtualizada) {
            throw new Error('Erro ao atualizar equipe');
        }
        return equipeAtualizada;
    }
}
exports.AtualizarEquipe = AtualizarEquipe;
//# sourceMappingURL=AtualizarEquipe.js.map