import { Vendedor } from "../../domain/entities/Vendedor";
import { VendedorRepository } from "../../domain/repositories/VendedorRepository";

export class CriarVendedor {
    constructor(private vendedorRepo: VendedorRepository) {}

    async executar(dados: { id: string; nome: string; equipe: string }) {
        const vendedor = new Vendedor(dados.id, dados.nome, dados.equipe);
        await this.vendedorRepo.criar(vendedor);
        return vendedor;
    }
}