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
exports.AtualizarVendedor = void 0;
class AtualizarVendedor {
    constructor(vendedorRepo) {
        this.vendedorRepo = vendedorRepo;
    }
    executar(id, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("📝 Iniciando atualização de vendedor com dados:", dados);
            if (!dados.nome || !dados.equipe_id) {
                throw new Error('Dados inválidos para atualizar vendedor');
            }
            const vendedorAtualizado = yield this.vendedorRepo.atualizar(id, dados);
            console.log("💾 Vendedor atualizado no banco:", vendedorAtualizado);
            return vendedorAtualizado;
        });
    }
}
exports.AtualizarVendedor = AtualizarVendedor;
