import { Meta } from "../../domain/entities/Meta";
import { MetaRepository } from "../../domain/repositories/MetaRepository";

export class MetaRepositoryImpl implements MetaRepository {
    private metas: Meta[] = [];

    async criar(meta: Meta): Promise<void> {
        this.metas.push(meta);
    }

    async obterPorEquipe(equipeId: string): Promise<Meta | null> {
        return this.metas.find(m => m.equipeId === equipeId) || null;
    }
}