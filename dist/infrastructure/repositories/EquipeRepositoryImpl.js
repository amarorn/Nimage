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
exports.EquipeRepositoryImpl = void 0;
const Equipe_1 = require("../../domain/entities/Equipe");
const EquipeModel_1 = require("../database/models/EquipeModel");
class EquipeRepositoryImpl {
    criar(equipe) {
        return __awaiter(this, void 0, void 0, function* () {
            yield EquipeModel_1.EquipeModel.create(equipe);
        });
    }
    obterPorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield EquipeModel_1.EquipeModel.findOne({ id }).lean();
        });
    }
    obterTodos(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield EquipeModel_1.EquipeModel.find().skip(skip).limit(limit).lean();
        });
    }
    atualizar(id, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            const equipeAtualizada = yield EquipeModel_1.EquipeModel.findOneAndUpdate({ id }, { nome: dados.nome }, { new: true }).lean();
            if (equipeAtualizada) {
                return new Equipe_1.Equipe(equipeAtualizada.id, equipeAtualizada.nome);
            }
            return null;
        });
    }
}
exports.EquipeRepositoryImpl = EquipeRepositoryImpl;
