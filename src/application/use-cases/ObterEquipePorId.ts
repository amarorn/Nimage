import { EquipeRepository } from "../../domain/repositories/EquipeRepository";
import { Equipe } from "../../domain/entities/Equipe";

export class ObterEquipePorId {
    constructor(private equipeRepo: EquipeRepository) {}

    async executar(id: string): Promise<Equipe | null> {
        return await this.equipeRepo.obterPorId(id);
    }
}