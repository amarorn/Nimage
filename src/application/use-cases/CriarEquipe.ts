import { Equipe } from "../../domain/entities/Equipe";
import { EquipeRepository } from "../../domain/repositories/EquipeRepository";
import { v4 as uuidv4 } from 'uuid';

interface CriarEquipeDTO {
    nome: string;
    pdv: string;
    cidade: string;
    estado: string;
    lojaId: string;
    gerenteNome?: string;
    gerenteTelefone?: string;
    capitaoNome?: string;
    capitaoTelefone?: string;
    temaId?: string;
}

export class CriarEquipe {
    constructor(private equipeRepo: EquipeRepository) {}

    async executar(dados: CriarEquipeDTO) {
        //console.log("📝 Iniciando criação de equipe com dados:", dados);

        if (!dados.nome || !dados.pdv || !dados.cidade || !dados.estado || !dados.lojaId) {
            throw new Error('Dados inválidos para criar equipe');
        }

        if (dados.nome.trim().length === 0) {
            throw new Error('Nome da equipe não pode estar vazio');
        }

        const equipe = new Equipe(
            uuidv4(),
            dados.nome,
            dados.pdv,
            dados.cidade,
            dados.estado,
            dados.lojaId,
            dados.gerenteNome,
            dados.gerenteTelefone,
            dados.capitaoNome,
            dados.capitaoTelefone,
            dados.temaId
        );
        //console.log("🏗️ Equipe instanciada:", equipe);

        await this.equipeRepo.criar(equipe);
        //console.log("💾 Equipe persistida no banco");

        return equipe;
    }
}