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
exports.CriarMeta = void 0;
const Meta_1 = require("../../domain/entities/Meta");
class CriarMeta {
    constructor(metaRepo) {
        this.metaRepo = metaRepo;
    }
    executar(dados) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("📝 Iniciando criação de meta com dados:", dados);
            if (!dados.id || !dados.equipeId || dados.objetivo === undefined) {
                throw new Error('Dados inválidos para criar meta');
            }
            if (dados.objetivo <= 0) {
                throw new Error('Objetivo da meta deve ser maior que zero');
            }
            const meta = new Meta_1.Meta(dados.id, dados.equipeId, dados.objetivo);
            //console.log("🏗️ Meta instanciada:", meta);
            yield this.metaRepo.criar(meta);
            //console.log("💾 Meta persistida no banco");
            return meta;
        });
    }
}
exports.CriarMeta = CriarMeta;
