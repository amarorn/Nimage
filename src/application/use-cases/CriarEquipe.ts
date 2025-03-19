import { Equipe } from "../../domain/entities/Equipe";
import { EquipeRepository } from "../../domain/repositories/EquipeRepository";

interface CriarEquipeDTO {
    id: string;
    nome: string;
    nomepdv: string;
    cidade: string;
    estado: string;
    gerente: string;
    contato_gerente: string;
    capitao: string;
    contato_capitao: string;
}

export class CriarEquipe {
    constructor(private equipeRepo: EquipeRepository) {}

    async executar(dados: CriarEquipeDTO) {
        //console.log("📝 Iniciando criação de equipe com dados:", dados);

        if (!dados.id || !dados.nome || !dados.nomepdv || !dados.cidade || !dados.estado || 
            !dados.gerente || !dados.contato_gerente || !dados.capitao || !dados.contato_capitao) {
            throw new Error('Dados inválidos para criar equipe');
        }

        if (dados.nome.trim().length === 0) {
            throw new Error('Nome da equipe não pode estar vazio');
        }

        const equipe = new Equipe(
            dados.id,
            dados.nome,
            dados.nomepdv,
            dados.cidade,
            dados.estado,
            dados.gerente,
            dados.contato_gerente,
            dados.capitao,
            dados.contato_capitao
        );
        //console.log("🏗️ Equipe instanciada:", equipe);

        await this.equipeRepo.criar(equipe);
        //console.log("💾 Equipe persistida no banco");

        return equipe;
    }
}