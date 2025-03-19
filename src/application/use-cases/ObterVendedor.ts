import { VendedorRepository } from "../../domain/repositories/VendedorRepository";
import { Vendedor } from "../../domain/entities/Vendedor";

export class ObterVendedor {
    constructor(private vendedorRepository: VendedorRepository) {}

    async executar(skip: number, limit: number): Promise<Vendedor[]> {
        //console.log("Executando ObterVendedor com paginação", { skip, limit });
        return await this.vendedorRepository.obterTodos(skip, limit);
    }

    async executarPorId(id: string): Promise<Vendedor | null> {
        if (!id) {
            throw new Error('ID do vendedor é obrigatório');
        }
        //console.log("Executando ObterVendedor por ID", { id });
        return await this.vendedorRepository.obterPorId(id);
    }

    async executarPorEquipeId(equipeId: string): Promise<Vendedor[]> {
        if (!equipeId) {
            throw new Error('ID da equipe é obrigatório');
        }
        return await this.vendedorRepository.obterPorEquipeId(equipeId);
    }
} 