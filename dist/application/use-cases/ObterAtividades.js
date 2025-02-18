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
exports.ObterAtividades = void 0;
class ObterAtividades {
    constructor(atividadeRepo) {
        this.atividadeRepo = atividadeRepo;
    }
    executar(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Executando ObterAtividades com paginação", { skip, limit });
            return yield this.atividadeRepo.obterTodos(skip, limit);
        });
    }
}
exports.ObterAtividades = ObterAtividades;
