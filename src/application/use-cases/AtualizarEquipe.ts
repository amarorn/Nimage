import { EquipeRepository } from "../../domain/repositories/EquipeRepository";
import { Equipe } from "../../domain/entities/Equipe";

export class AtualizarEquipe {
    constructor(private equipeRepo: EquipeRepository) {}

    async executar(id: string, dados: { nome?: string; 
        nomepdv?: string;
        cidade?: string; 
        estado?: string; 
        gerente?: string; 
        contato_gerente?: string; 
        capitao?: string; 
        contato_capitao?: string }): Promise<Equipe | null> {
        if (!id) {
            throw new Error('ID da equipe não fornecido');
        }

        // Verifica se a equipe existe
        const equipeExistente = await this.equipeRepo.obterPorId(id);
        if (!equipeExistente) {
            throw new Error('Equipe não encontrada');
        }

        // Valida os campos fornecidos
        if (dados.nome && dados.nome.trim().length === 0) {
            throw new Error('Nome da equipe não pode estar vazio');
        }

        // Atualiza a equipe
        const equipeAtualizada = await this.equipeRepo.atualizar(id, dados);
        if (!equipeAtualizada) {
            throw new Error('Erro ao atualizar equipe');
        }

        return equipeAtualizada;
    }
} 