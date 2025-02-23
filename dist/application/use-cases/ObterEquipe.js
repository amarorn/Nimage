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
exports.ObterEquipe = void 0;
class ObterEquipe {
    constructor(equipeRepo) {
        this.equipeRepo = equipeRepo;
    }
    executar(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("Executando ObterEquipe com paginação", { skip, limit });
            return yield this.equipeRepo.obterTodos(skip, limit);
        });
    }
    executarPorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("Executando ObterEquipe por ID", { id });
            return yield this.equipeRepo.obterPorId(id);
        });
    }
}
exports.ObterEquipe = ObterEquipe;
