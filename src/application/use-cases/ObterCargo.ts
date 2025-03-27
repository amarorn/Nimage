import { Cargo } from "../../domain/entities/Cargo";
import { CargoRepository } from "../../domain/repositories/CargoRepository";

export class ObterCargo {
    constructor(private cargoRepo: CargoRepository) {}

    async executar(skip: number, limit: number): Promise<{ cargos: Cargo[], total: number }> {
        const [cargos, total] = await Promise.all([
            this.cargoRepo.obterTodos(skip, limit),
            this.cargoRepo.obterTotal()
        ]);

        return { cargos, total };
    }

    async executarPorId(id: string): Promise<Cargo | null> {
        return await this.cargoRepo.obterPorId(id);
    }
} 