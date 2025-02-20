import { Atividade } from "../../domain/entities/Atividade";
import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";
import { AtividadeModel } from "../database/models/AtividadeModel";

export class AtividadeRepositoryImpl implements AtividadeRepository {

    async criar(atividade: Atividade): Promise<void> {
        await AtividadeModel.create(atividade);
    }

    async obterPorId(id: string): Promise<Atividade | null> {
        return await AtividadeModel.findOne({ id }).lean();
    }

    async obterTodos(skip: number, limit: number): Promise<Atividade[]> {
        return await AtividadeModel.find().skip(skip).limit(limit).lean();
    }

    async obterAtividadesPorEquipe(equipeId: string): Promise<Atividade[]> {
        return await AtividadeModel.find({ vendedorId: equipeId }).lean();
    }
}