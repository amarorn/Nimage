import { Montadora } from '../../domain/entities/Montadora';
import { MontadoraRepository } from '../../domain/repositories/MontadoraRepository';
import { MontadoraModel } from '../database/models/MontadoraModel';
import { MongoDB } from '../database/MongoDB';

export class MontadoraRepositoryImpl implements MontadoraRepository {
    async criar(montadora: Montadora): Promise<Montadora> {
        await MongoDB.trackOperation('criar', 'montadoras', async () => {
            await MontadoraModel.create(montadora);
        });
        return montadora;
    }

    async atualizar(id: string, dados: Partial<Montadora>): Promise<Montadora | null> {
        return await MongoDB.trackOperation('atualizar', 'montadoras', async () => {
            const atualizado = await MontadoraModel.findOneAndUpdate({ id }, { $set: dados }, { new: true });
            return atualizado ? atualizado : null;
        });
    }

    async obterPorId(id: string): Promise<Montadora | null> {
        return await MongoDB.trackOperation('obterPorId', 'montadoras', async () => {
            return await MontadoraModel.findOne({ id });
        });
    }

    async obterTodos(skip: number, limit: number): Promise<Montadora[]> {
        return await MongoDB.trackOperation('obterTodos', 'montadoras', async () => {
            return await MontadoraModel.find().skip(skip).limit(limit);
        });
    }

    async deletar(id: string): Promise<void> {
        await MongoDB.trackOperation('deletar', 'montadoras', async () => {
            await MontadoraModel.deleteOne({ id });
        });
    }
} 