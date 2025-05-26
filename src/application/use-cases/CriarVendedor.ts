import { Vendedor } from "../../domain/entities/Vendedor";
import { VendedorRepository } from "../../domain/repositories/VendedorRepository";
import { v4 as uuidv4 } from 'uuid';

interface CriarVendedorDTO {
    nome: string;
    equipeId: string;
    email: string;
    telefone: string;
    meta: number;
    cargo: string;
}

export class CriarVendedor {
    constructor(private vendedorRepository: VendedorRepository) {}

    async executar(dados: CriarVendedorDTO): Promise<Vendedor> {
        //console.log("📝 Iniciando criação de vendedor com dados:", dados);

        if (!dados.nome || !dados.equipeId || !dados.email || !dados.telefone || !dados.meta || !dados.cargo) {
            throw new Error('Dados inválidos para criar vendedor');
        }

        const vendedor = new Vendedor(
            uuidv4(),
            dados.nome,
            dados.equipeId,
            dados.email,
            dados.telefone,
            dados.meta,
            dados.cargo
        );
        //console.log("🏗️ Vendedor instanciado:", vendedor);

        await this.vendedorRepository.criar(vendedor);
        //console.log("💾 Vendedor persistido no banco");

        return vendedor;
    }

    async obterTodos() {
        return await this.vendedorRepository.obterTodos(0, Number.MAX_SAFE_INTEGER);
    }
}