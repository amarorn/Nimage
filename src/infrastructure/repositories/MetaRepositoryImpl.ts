import { Meta } from "../../domain/entities/Meta";
import { MetaRepository } from "../../domain/repositories/MetaRepository";
import { MetaModel } from "../database/models/MetaModel"

export class MetaRepositoryImpl implements MetaRepository {
    private metas: Meta[] = [];

    async criar(meta: Meta): Promise<void> {
        await MetaModel.create(meta);
    }

    async obterPorEquipe(equipeId: string): Promise<Meta | null> {
        return await MetaModel.findOne({ equipeId }).lean();
    }
}