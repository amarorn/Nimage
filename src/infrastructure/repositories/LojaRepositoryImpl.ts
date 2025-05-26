import { LojaRepository } from '../../domain/repositories/LojaRepository';
import { Loja } from '../../domain/entities/Loja';
import { LojaModel, ILoja } from '../database/models/LojaModel';
import { MongoDB } from '../database/MongoDB';

export class LojaRepositoryImpl implements LojaRepository {
    async criar(loja: Loja): Promise<void> {
        await MongoDB.trackOperation('criar', 'lojas', async () => {
            await LojaModel.create({
                id: loja.id,
                nome: loja.nome,
                cnpj: loja.cnpj,
                telefone: loja.telefone,
                montadoraId: loja.montadoraId
            });
        });
    }

    async atualizar(id: string, dados: Partial<Loja>): Promise<Loja | null> {
        const loja = await LojaModel.findOneAndUpdate({ id }, { $set: dados }, { new: true });
        if (!loja) return null;
        return this.toDomain(loja);
    }

    async obterPorId(id: string): Promise<Loja | null> {
        const loja = await LojaModel.findOne({ id });
        if (!loja) return null;
        return this.toDomain(loja);
    }

    async obterTodos(skip: number, limit: number): Promise<Loja[]> {
        const lojas = await LojaModel.find().skip(skip).limit(limit);
        return lojas.map(this.toDomain);
    }

    async deletar(id: string): Promise<void> {
        await LojaModel.deleteOne({ id });
    }

    async obterTotal(): Promise<number> {
        return LojaModel.countDocuments();
    }

    private toDomain(loja: ILoja): Loja {
        return new Loja(loja.id, loja.nome, loja.cnpj, loja.telefone, loja.montadoraId);
    }
} 