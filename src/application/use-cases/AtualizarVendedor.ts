import { Vendedor } from "../../domain/entities/Vendedor";
import { VendedorRepository } from "../../domain/repositories/VendedorRepository";

interface AtualizarVendedorDTO {
    nome?: string;
    equipeId?: string;
    email?: string;
    telefone?: string;
    meta?: number;
    cargo?: string;
}

export class AtualizarVendedor {
    constructor(private vendedorRepository: VendedorRepository) {}

    async executar(id: string, dados: AtualizarVendedorDTO): Promise<Vendedor | null> {
        if (!id) {
            throw new Error('ID do vendedor é obrigatório');
        }

        // Verifica se o vendedor existe
        const vendedorExistente = await this.vendedorRepository.obterPorId(id);
        if (!vendedorExistente) {
            throw new Error('Vendedor não encontrado');
        }

        // Filtra apenas os campos que foram fornecidos
        const dadosAtualizacao: AtualizarVendedorDTO = {};
        if (dados.nome !== undefined) dadosAtualizacao.nome = dados.nome;
        if (dados.equipeId !== undefined) dadosAtualizacao.equipeId = dados.equipeId;
        if (dados.email !== undefined) dadosAtualizacao.email = dados.email;
        if (dados.telefone !== undefined) dadosAtualizacao.telefone = dados.telefone;
        if (dados.meta !== undefined) dadosAtualizacao.meta = dados.meta;
        if (dados.cargo !== undefined) dadosAtualizacao.cargo = dados.cargo;

        return await this.vendedorRepository.atualizar(id, dadosAtualizacao);
    }
} 