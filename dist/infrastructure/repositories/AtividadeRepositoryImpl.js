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
exports.AtividadeRepositoryImpl = void 0;
const Atividade_1 = require("../../domain/entities/Atividade");
const AtividadeModel_1 = require("../database/models/AtividadeModel");
class AtividadeRepositoryImpl {
    criar(atividade) {
        return __awaiter(this, void 0, void 0, function* () {
            yield AtividadeModel_1.AtividadeModel.create(atividade);
        });
    }
    obterPorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AtividadeModel_1.AtividadeModel.findOne({ id }).lean();
        });
    }
    obterTodos(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AtividadeModel_1.AtividadeModel.find().skip(skip).limit(limit).lean();
        });
    }
    obterPorVendedorId(vendedorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AtividadeModel_1.AtividadeModel.find({ vendedorId }).lean();
        });
    }
    atualizar(id, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            const atividadeAtualizada = yield AtividadeModel_1.AtividadeModel.findOneAndUpdate({ id }, { vendedorId: dados.vendedorId, data: dados.data, docinhosCoco: dados.docinhosCoco }, { new: true }).lean();
            if (atividadeAtualizada) {
                return new Atividade_1.Atividade(atividadeAtualizada.id, atividadeAtualizada.vendedorId, atividadeAtualizada.data, atividadeAtualizada.docinhosCoco);
            }
            return null;
        });
    }
}
exports.AtividadeRepositoryImpl = AtividadeRepositoryImpl;
