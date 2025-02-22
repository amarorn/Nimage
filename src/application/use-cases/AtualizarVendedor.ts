import { VendedorRepository } from "../../domain/repositories/VendedorRepository";
import { Vendedor } from "../../domain/entities/Vendedor";

export class AtualizarVendedor {
    constructor(private vendedorRepo: VendedorRepository) {}

    async executar(id: string, dados: { nome: string; equipe_id: string }): Promise<Vendedor | null> {
        console.log("📝 Iniciando atualização de vendedor com dados:", dados);

        if (!dados.nome || !dados.equipe_id) {
            throw new Error('Dados inválidos para atualizar vendedor');
        }

        const vendedorAtualizado = await this.vendedorRepo.atualizar(id, dados);
        console.log("💾 Vendedor atualizado no banco:", vendedorAtualizado);

        return vendedorAtualizado;
    }
} 