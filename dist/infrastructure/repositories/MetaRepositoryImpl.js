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
exports.MetaRepositoryImpl = void 0;
const Meta_1 = require("../../domain/entities/Meta");
const MetaModel_1 = require("../database/models/MetaModel");
class MetaRepositoryImpl {
    constructor() {
        this.metas = [];
    }
    criar(meta) {
        return __awaiter(this, void 0, void 0, function* () {
            yield MetaModel_1.MetaModel.create(meta);
        });
    }
    obterPorEquipe(equipeId) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("🔍 Buscando meta para equipe ID:", equipeId);
            return yield MetaModel_1.MetaModel.findOne({ equipeId }).lean();
        });
    }
    obterPorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MetaModel_1.MetaModel.findOne({ id }).lean();
        });
    }
    obterTodos(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MetaModel_1.MetaModel.find().skip(skip).limit(limit).lean();
        });
    }
    atualizar(id, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            const metaAtualizada = yield MetaModel_1.MetaModel.findOneAndUpdate({ id }, { equipeId: dados.equipeId, objetivo: dados.objetivo }, { new: true }).lean();
            if (metaAtualizada) {
                return new Meta_1.Meta(metaAtualizada.id, metaAtualizada.equipeId, metaAtualizada.objetivo);
            }
            return null;
        });
    }
}
exports.MetaRepositoryImpl = MetaRepositoryImpl;
