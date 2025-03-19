"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarEquipe = void 0;
class AtualizarEquipe {
    constructor(equipeRepo) {
        this.equipeRepo = equipeRepo;
    }
    executar(id, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('ID da equipe não fornecido');
            }
            // Verifica se a equipe existe
            const equipeExistente = yield this.equipeRepo.obterPorId(id);
            if (!equipeExistente) {
                throw new Error('Equipe não encontrada');
            }
            // Valida os campos fornecidos
            if (dados.nome && dados.nome.trim().length === 0) {
                throw new Error('Nome da equipe não pode estar vazio');
            }
            // Atualiza a equipe
            const equipeAtualizada = yield this.equipeRepo.atualizar(id, dados);
            if (!equipeAtualizada) {
                throw new Error('Erro ao atualizar equipe');
            }
            return equipeAtualizada;
        });
    }
}
exports.AtualizarEquipe = AtualizarEquipe;
//# sourceMappingURL=AtualizarEquipe.js.map