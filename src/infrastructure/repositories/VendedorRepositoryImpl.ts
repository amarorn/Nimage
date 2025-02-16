import { Vendedor } from "../../domain/entities/Vendedor";
import { VendedorRepository } from "../../domain/repositories/VendedorRepository";

export class VendedorRepositoryImpl implements VendedorRepository {
    private vendedores: Vendedor[] = [];

    async criar(vendedor: Vendedor): Promise<void> {
        this.vendedores.push(vendedor);
    }

    async obterPorId(id: string): Promise<Vendedor | null> {
        return this.vendedores.find(v => v.id === id) || null;
    }
}