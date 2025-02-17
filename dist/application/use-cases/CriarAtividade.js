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
exports.CriarAtividade = void 0;
const Atividade_1 = require("../../domain/entities/Atividade");
class CriarAtividade {
    constructor(atividadeRepo) {
        this.atividadeRepo = atividadeRepo;
    }
    executar(dados) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("📝 Iniciando criação de atividade com dados:", dados);
            if (!dados.id || !dados.vendedorId || !dados.data || dados.docinhosCoco === undefined) {
                throw new Error('Dados inválidos para criar atividade');
            }
            if (dados.docinhosCoco < 0) {
                throw new Error('Quantidade de docinhos não pode ser negativa');
            }
            const atividade = new Atividade_1.Atividade(dados.id, dados.vendedorId, dados.data, dados.docinhosCoco);
            console.log("🏗️ Atividade instanciada:", atividade);
            yield this.atividadeRepo.criar(atividade);
            console.log("💾 Atividade persistida no banco");
            return atividade;
        });
    }
}
exports.CriarAtividade = CriarAtividade;
