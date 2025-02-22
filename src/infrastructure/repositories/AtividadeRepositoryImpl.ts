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

    async obterPorVendedorId(vendedorId: string): Promise<Atividade[]> {
        return await AtividadeModel.find({ vendedorId }).lean();
    }

    async atualizar(id: string, dados: { vendedorId: string; data: Date; docinhosCoco: number }): Promise<Atividade | null> {
        const atividadeAtualizada = await AtividadeModel.findOneAndUpdate(
            { id },
            { vendedorId: dados.vendedorId, data: dados.data, docinhosCoco: dados.docinhosCoco },
            { new: true }
        ).lean();

        if (atividadeAtualizada) {
            return new Atividade(atividadeAtualizada.id, atividadeAtualizada.vendedorId, atividadeAtualizada.data, atividadeAtualizada.docinhosCoco);
        }
        return null;
    }
}