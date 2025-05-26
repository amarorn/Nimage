"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarVendedor = void 0;
const Vendedor_1 = require("../../domain/entities/Vendedor");
const uuid_1 = require("uuid");
class CriarVendedor {
    constructor(vendedorRepository) {
        this.vendedorRepository = vendedorRepository;
    }
    async executar(dados) {
        //console.log("📝 Iniciando criação de vendedor com dados:", dados);
        if (!dados.nome || !dados.equipeId || !dados.email || !dados.telefone || !dados.meta || !dados.cargo) {
            throw new Error('Dados inválidos para criar vendedor');
        }
        const vendedor = new Vendedor_1.Vendedor((0, uuid_1.v4)(), dados.nome, dados.equipeId, dados.email, dados.telefone, dados.meta, dados.cargo);
        //console.log("🏗️ Vendedor instanciado:", vendedor);
        await this.vendedorRepository.criar(vendedor);
        //console.log("💾 Vendedor persistido no banco");
        return vendedor;
    }
    async obterTodos() {
        return await this.vendedorRepository.obterTodos(0, Number.MAX_SAFE_INTEGER);
    }
}
exports.CriarVendedor = CriarVendedor;
//# sourceMappingURL=CriarVendedor.js.map