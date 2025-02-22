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
exports.VendedorRepositoryImpl = void 0;
const Vendedor_1 = require("../../domain/entities/Vendedor");
const VendedorModel_1 = require("../database/models/VendedorModel");
const EquipeModel_1 = require("../database/models/EquipeModel");
class VendedorRepositoryImpl {
    criar(vendedor) {
        return __awaiter(this, void 0, void 0, function* () {
            yield VendedorModel_1.VendedorModel.create(vendedor);
        });
    }
    obterPorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendedor = yield VendedorModel_1.VendedorModel.findOne({ id }).lean();
            if (vendedor) {
                const equipe = yield EquipeModel_1.EquipeModel.findOne({ id: vendedor.equipe_id }).lean();
                return new Vendedor_1.Vendedor(vendedor.id, vendedor.nome, vendedor.equipe_id, equipe ? { id: equipe.id, nome: equipe.nome } : null);
            }
            return null;
        });
    }
    obterTodos(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendedores = yield VendedorModel_1.VendedorModel.find().skip(skip).limit(limit).lean();
            return yield Promise.all(vendedores.map((vendedor) => __awaiter(this, void 0, void 0, function* () {
                const equipe = yield EquipeModel_1.EquipeModel.findOne({ id: vendedor.equipe_id }).lean();
                return new Vendedor_1.Vendedor(vendedor.id, vendedor.nome, vendedor.equipe_id, equipe ? { id: equipe.id, nome: equipe.nome } : null);
            })));
        });
    }
    obterPorEquipeId(equipeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendedores = yield VendedorModel_1.VendedorModel.find({ equipe_id: equipeId }).lean();
            return yield Promise.all(vendedores.map((vendedor) => __awaiter(this, void 0, void 0, function* () {
                const equipe = yield EquipeModel_1.EquipeModel.findOne({ id: vendedor.equipe_id }).lean();
                return new Vendedor_1.Vendedor(vendedor.id, vendedor.nome, vendedor.equipe_id, equipe ? { id: equipe.id, nome: equipe.nome } : null);
            })));
        });
    }
    atualizar(id, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendedorAtualizado = yield VendedorModel_1.VendedorModel.findOneAndUpdate({ id }, { nome: dados.nome, equipe_id: dados.equipe_id }, { new: true }).lean();
            if (vendedorAtualizado) {
                const equipe = yield EquipeModel_1.EquipeModel.findOne({ id: vendedorAtualizado.equipe_id }).lean();
                return new Vendedor_1.Vendedor(vendedorAtualizado.id, vendedorAtualizado.nome, vendedorAtualizado.equipe_id, equipe ? { id: equipe.id, nome: equipe.nome } : null);
            }
            return null;
        });
    }
}
exports.VendedorRepositoryImpl = VendedorRepositoryImpl;
