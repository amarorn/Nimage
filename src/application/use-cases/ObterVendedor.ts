import { VendedorRepository } from "../../domain/repositories/VendedorRepository";

export class ObterVendedor {
    constructor(private vendedorRepo: VendedorRepository) {}

    async executar(skip: number, limit: number) {
        console.log("Executando ObterVendedor com paginação", { skip, limit });
        return await this.vendedorRepo.obterTodos(skip, limit);
    }
} 