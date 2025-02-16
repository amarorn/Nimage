import { Vendedor } from "../../domain/entities/Vendedor";
import { VendedorRepository } from "../../domain/repositories/VendedorRepository";

export class CriarVendedor {
    constructor(private vendedorRepo: VendedorRepository) {
        console.log("CriarVendedor construtor");
    }

    async executar(dados: { id: string; nome: string; equipe: string }) {
        console.log("CriarVendedor caso de uso");
        console.log("Dados recebidos:", dados);
        const vendedor = new Vendedor(dados.id, dados.nome, dados.equipe);
        await this.vendedorRepo.criar(vendedor);
        return vendedor;
    }
}