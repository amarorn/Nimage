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
exports.ObterVendedor = void 0;
class ObterVendedor {
    constructor(vendedorRepository) {
        this.vendedorRepository = vendedorRepository;
    }
    executar(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log("Executando ObterVendedor com paginação", { skip, limit });
            return yield this.vendedorRepository.obterTodos(skip, limit);
        });
    }
    executarPorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('ID do vendedor é obrigatório');
            }
            //console.log("Executando ObterVendedor por ID", { id });
            return yield this.vendedorRepository.obterPorId(id);
        });
    }
    executarPorEquipeId(equipeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!equipeId) {
                throw new Error('ID da equipe é obrigatório');
            }
            return yield this.vendedorRepository.obterPorEquipeId(equipeId);
        });
    }
}
exports.ObterVendedor = ObterVendedor;
//# sourceMappingURL=ObterVendedor.js.map