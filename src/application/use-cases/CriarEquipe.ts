import { Equipe } from "../../domain/entities/Equipe";
import { EquipeRepository } from "../../domain/repositories/EquipeRepository";

export class CriarEquipe {
    constructor(private equipeRepo: EquipeRepository) {}

    async executar(dados: { id: string; nome: string }) {
        //console.log("📝 Iniciando criação de equipe com dados:", dados);

        if (!dados.id || !dados.nome) {
            throw new Error('Dados inválidos para criar equipe');
        }

        if (dados.nome.trim().length === 0) {
            throw new Error('Nome da equipe não pode estar vazio');
        }

        const equipe = new Equipe(dados.id, dados.nome);
        //console.log("🏗️ Equipe instanciada:", equipe);

        await this.equipeRepo.criar(equipe);
        //console.log("💾 Equipe persistida no banco");

        return equipe;
    }
}