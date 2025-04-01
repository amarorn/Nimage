import { Meta } from "../../domain/entities/Meta";
import { MetaRepository } from "../../domain/repositories/MetaRepository";
import { MetaModel } from "../database/models/MetaModel";
import { MongoDB } from "../database/MongoDB";

export class MetaRepositoryImpl implements MetaRepository {
    private metas: Meta[] = [];

    async criar(meta: Meta): Promise<void> {
        await MongoDB.trackOperation('create', 'metas', async () => {
            await MetaModel.create(meta);
        });
    }

    async obterPorEquipe(equipeId: string): Promise<Meta | null> {
        return MongoDB.trackOperation('findOne', 'metas', async () => {
            const meta = await MetaModel.findOne({ equipeId: equipeId });
            console.log('Meta encontrada:', meta);
            return meta ? this.toDomain(meta) : null;
        });
    }

    async obterPorId(id: string): Promise<Meta | null> {
        return MongoDB.trackOperation('findById', 'metas', async () => {
            return await MetaModel.findById(id);
        });
    }

    async obterPorEquipeEData(equipeId: string, dataInicio: Date, dataFim: Date): Promise<Meta | null> {
        return MongoDB.trackOperation('findOne', 'metas', async () => {
            console.log('Buscando meta por equipe e data:', { equipeId, dataInicio, dataFim });
            const meta = await MetaModel.findOne({
                equipeId: equipeId,
                data: { $gte: dataInicio, $lte: dataFim }
            });
            console.log('Meta encontrada:', meta);
            return meta ? this.toDomain(meta) : null;
        });
    }

    async obterTodos(skip: number, limit: number): Promise<Meta[]> {
        return MongoDB.trackOperation('find', 'metas', async () => {
            return await MetaModel.find().skip(skip).limit(limit);
        });
    }

    async atualizar(id: string, dados: { equipeId: string; objetivo: number; data: Date }): Promise<Meta | null> {
        return MongoDB.trackOperation('findByIdAndUpdate', 'metas', async () => {
            const metaAtualizada = await MetaModel.findByIdAndUpdate(
                id,
                dados,
                { new: true }
            );

            if (metaAtualizada) {
                return new Meta(metaAtualizada.id, metaAtualizada.equipeId, metaAtualizada.objetivo, metaAtualizada.data);
            }
            return null;
        });
    }

    async deletar(id: string): Promise<void> {
        await MongoDB.trackOperation('findByIdAndDelete', 'metas', async () => {
            await MetaModel.findByIdAndDelete(id);
        });
    }

    async deletarTodos(): Promise<void> {
        await MongoDB.trackOperation('deleteMany', 'metas', async () => {
            await MetaModel.deleteMany({});
        });
    }

    private toDomain(meta: any): Meta {
        return new Meta(
            meta.id || meta._id.toString(),
            meta.equipeId,
            meta.objetivo,
            meta.data
        );
    }
}