import { Cargo } from "../../domain/entities/Cargo";
import { CargoRepository } from "../../domain/repositories/CargoRepository";

export class CriarCargo {
    constructor(private cargoRepo: CargoRepository) {}

    async executar(dados: { id: string; nome: string; descricao: string; tag: string }): Promise<Cargo> {
        if (!dados.id || !dados.nome || !dados.descricao || !dados.tag) {
            throw new Error('Dados inválidos para criar cargo');
        }

        const cargo = new Cargo(
            dados.id,
            dados.nome,
            dados.descricao,
            dados.tag
        );

        await this.cargoRepo.criar(cargo);
        return cargo;
    }
} 