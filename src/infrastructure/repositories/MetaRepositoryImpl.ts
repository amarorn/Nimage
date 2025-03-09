import { Meta } from "../../domain/entities/Meta";
import { MetaRepository } from "../../domain/repositories/MetaRepository";
import { MetaModel } from "../database/models/MetaModel"

export class MetaRepositoryImpl implements MetaRepository {
    private metas: Meta[] = [];

    async criar(meta: Meta): Promise<void> {
        await MetaModel.create(meta);
    }

    async obterPorEquipe(equipeId: string): Promise<Meta | null> {
        //console.log("🔍 Buscando meta para equipe ID:", equipeId);
        return await MetaModel.findOne({ equipeId }).lean();
    }

    async obterPorId(id: string): Promise<Meta | null> {
        return await MetaModel.findOne({ id }).lean();
    }

    async obterPorEquipeEData(equipeId: string, dataInicio: Date, dataFim: Date): Promise<Meta | null> {
        return await MetaModel.findOne({
            equipeId,
            data: { $gte: dataInicio, $lte: dataFim }
        }).lean();
    }

    async obterTodos(skip: number, limit: number): Promise<Meta[]> {
        return await MetaModel.find().skip(skip).limit(limit).lean();
    }

    async atualizar(id: string, dados: { equipeId: string; objetivo: number; data: Date }): Promise<Meta | null> {
        const metaAtualizada = await MetaModel.findOneAndUpdate(
            { id },
            { equipeId: dados.equipeId, objetivo: dados.objetivo, data: dados.data },
            { new: true }
        ).lean();

        if (metaAtualizada) {
            return new Meta(metaAtualizada.id, metaAtualizada.equipeId, metaAtualizada.objetivo, metaAtualizada.data);
        }
        return null;
    }
}