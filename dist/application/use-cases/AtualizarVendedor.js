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
    constructor(vendedorRepository) {
        this.vendedorRepository = vendedorRepository;
    }
    executar(id, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('ID do vendedor é obrigatório');
            }
            // Verifica se o vendedor existe
            const vendedorExistente = yield this.vendedorRepository.obterPorId(id);
            if (!vendedorExistente) {
                throw new Error('Vendedor não encontrado');
            }
            // Filtra apenas os campos que foram fornecidos
            const dadosAtualizacao = {};
            if (dados.nome !== undefined)
                dadosAtualizacao.nome = dados.nome;
            if (dados.equipeId !== undefined)
                dadosAtualizacao.equipeId = dados.equipeId;
            if (dados.email !== undefined)
                dadosAtualizacao.email = dados.email;
            if (dados.telefone !== undefined)
                dadosAtualizacao.telefone = dados.telefone;
            if (dados.meta !== undefined)
                dadosAtualizacao.meta = dados.meta;
            if (dados.cargo !== undefined)
                dadosAtualizacao.cargo = dados.cargo;
            return yield this.vendedorRepository.atualizar(id, dadosAtualizacao);
        });
    }
}
exports.AtualizarVendedor = AtualizarVendedor;
//# sourceMappingURL=AtualizarVendedor.js.map