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
exports.CriarVendedor = void 0;
const Vendedor_1 = require("../../domain/entities/Vendedor");
class CriarVendedor {
    constructor(vendedorRepo) {
        this.vendedorRepo = vendedorRepo;
    }
    executar(dados) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("📝 Iniciando criação de vendedor com dados:", dados);
            if (!dados.id || !dados.nome || !dados.equipe) {
                throw new Error('Dados inválidos para criar vendedor');
            }
            const vendedor = new Vendedor_1.Vendedor(dados.id, dados.nome, dados.equipe);
            console.log("🏗️ Vendedor instanciado:", vendedor);
            yield this.vendedorRepo.criar(vendedor);
            console.log("💾 Vendedor persistido no banco");
            return vendedor;
        });
    }
}
exports.CriarVendedor = CriarVendedor;
