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
exports.CriarEquipe = void 0;
const Equipe_1 = require("../../domain/entities/Equipe");
class CriarEquipe {
    constructor(equipeRepo) {
        this.equipeRepo = equipeRepo;
    }
    executar(dados) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("📝 Iniciando criação de equipe com dados:", dados);
            if (!dados.id || !dados.nome) {
                throw new Error('Dados inválidos para criar equipe');
            }
            if (dados.nome.trim().length === 0) {
                throw new Error('Nome da equipe não pode estar vazio');
            }
            const equipe = new Equipe_1.Equipe(dados.id, dados.nome);
            console.log("🏗️ Equipe instanciada:", equipe);
            yield this.equipeRepo.criar(equipe);
            console.log("💾 Equipe persistida no banco");
            return equipe;
        });
    }
}
exports.CriarEquipe = CriarEquipe;
