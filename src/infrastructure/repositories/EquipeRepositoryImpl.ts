import { Equipe } from "../../domain/entities/Equipe";
import { EquipeRepository } from "../../domain/repositories/EquipeRepository";
import { EquipeModel } from "../database/models/EquipeModel";

export class EquipeRepositoryImpl implements EquipeRepository {
    async criar(equipe: Equipe): Promise<void> {
        await EquipeModel.create(equipe);
    }

    async obterPorId(id: string): Promise<Equipe | null> {
        return await EquipeModel.findOne({ id }).lean();
    }
    
    async obterTodos(skip: number, limit: number): Promise<Equipe[]> {
        return await EquipeModel.find().skip(skip).limit(limit).lean();
    }

    async atualizar(id: string, dados: { nome: string }): Promise<Equipe | null> {
        const equipeAtualizada = await EquipeModel.findOneAndUpdate(
            { id },
            { nome: dados.nome },
            { new: true }
        ).lean();

        if (equipeAtualizada) {
            return new Equipe(equipeAtualizada.id, equipeAtualizada.nome);
        }
        return null;
    }
}