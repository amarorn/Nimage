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
exports.AtualizarMeta = void 0;
class AtualizarMeta {
    constructor(metaRepo) {
        this.metaRepo = metaRepo;
    }
    executar(id, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("📝 Iniciando atualização de meta com dados:", dados);
            if (!dados.equipeId || dados.objetivo === undefined) {
                throw new Error('Dados inválidos para atualizar meta');
            }
            const metaAtualizada = yield this.metaRepo.atualizar(id, dados);
            console.log("💾 Meta atualizada no banco:", metaAtualizada);
            return metaAtualizada;
        });
    }
}
exports.AtualizarMeta = AtualizarMeta;
