import { Equipe } from "../../domain/entities/Equipe";
import { EquipeRepository } from "../../domain/repositories/EquipeRepository";

export class EquipeRepositoryImpl implements EquipeRepository {
    private equipes: Equipe[] = [];

    async criar(equipe: Equipe): Promise<void> {
        this.equipes.push(equipe);
    }

    async obterPorId(id: string): Promise<Equipe | null> {
        return this.equipes.find(e => e.id === id) || null;
    }
}