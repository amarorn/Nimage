import { Vendedor } from "../../domain/entities/Vendedor";
import { VendedorRepository } from "../../domain/repositories/VendedorRepository";

export class CriarVendedor {
    constructor(private vendedorRepo: VendedorRepository) {
    }

    async executar(dados: { id: string; nome: string; equipe: string }) {
        console.log("CriarVendedor caso de uso");
        const vendedor = new Vendedor(dados.id, dados.nome, dados.equipe);
        console.log("Vendedor criado:", vendedor);
        await this.vendedorRepo.criar(vendedor);
        return vendedor;
    }
}