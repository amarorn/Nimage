import { VendedorRepository } from "../../domain/repositories/VendedorRepository";
import { Vendedor } from "../../domain/entities/Vendedor";

export class ObterVendedor {
    constructor(private vendedorRepo: VendedorRepository) {}

    async executar(skip: number, limit: number): Promise<Vendedor[]> {
        console.log("Executando ObterVendedor com paginação", { skip, limit });
        return await this.vendedorRepo.obterTodos(skip, limit);
    }

    async executarPorId(id: string): Promise<Vendedor | null> {
        console.log("Executando ObterVendedor por ID", { id });
        return await this.vendedorRepo.obterPorId(id);
    }
} 