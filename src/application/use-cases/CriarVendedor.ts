import { Vendedor } from "../../domain/entities/Vendedor";
import { VendedorRepository } from "../../domain/repositories/VendedorRepository";

export class CriarVendedor {
    constructor(private vendedorRepo: VendedorRepository) {
    }

    async executar(dados: { id: string; nome: string; equipe_id: string }) {
        //console.log("📝 Iniciando criação de vendedor com dados:", dados);

        if (!dados.id || !dados.nome || !dados.equipe_id) {
            throw new Error('Dados inválidos para criar vendedor');
        }

        const vendedor = new Vendedor(dados.id, dados.nome, dados.equipe_id);
        //console.log("🏗️ Vendedor instanciado:", vendedor);

        await this.vendedorRepo.criar(vendedor);
        //console.log("💾 Vendedor persistido no banco");

        return vendedor;
    }

    async obterTodos() {
        return await this.vendedorRepo.obterTodos(0, Number.MAX_SAFE_INTEGER);
    }
}