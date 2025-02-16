import { Equipe } from "../../domain/entities/Equipe";
import { EquipeRepository } from "../../domain/repositories/EquipeRepository";

export class CriarEquipe {
    constructor(private equipeRepo: EquipeRepository) {}

    async executar(dados: { id: string; nome: string }) {
        const equipe = new Equipe(dados.id, dados.nome);
        await this.equipeRepo.criar(equipe);
        return equipe;
    }
}