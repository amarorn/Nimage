import { Cargo } from "../../domain/entities/Cargo";
import { CargoRepository } from "../../domain/repositories/CargoRepository";

export class AtualizarCargo {
    constructor(private cargoRepo: CargoRepository) {}

    async executar(id: string, dados: { nome: string; descricao: string; tag: string }): Promise<Cargo | null> {
        if (!dados.nome || !dados.descricao || !dados.tag) {
            throw new Error('Dados inválidos para atualizar cargo');
        }

        return await this.cargoRepo.atualizar(id, dados);
    }
} 