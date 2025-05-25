import { Atividade } from "../../domain/entities/Atividade";
import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";
import { AtividadeModel } from "../database/models/AtividadeModel";
import { MongoDB } from "../database/MongoDB";

export class AtividadeRepositoryImpl implements AtividadeRepository {

    async criar(atividade: Atividade): Promise<void> {
        await MongoDB.trackOperation('create', 'atividades', async () => {
            await AtividadeModel.create(atividade);
        });
    }

    async obterPorId(id: string): Promise<Atividade | null> {
        return MongoDB.trackOperation('findById', 'atividades', async () => {
            const atividade = await AtividadeModel.findById(id).lean();
            if (atividade) {
                return new Atividade(
                    atividade.id,
                    atividade.vendedorId,
                    atividade.data,
                    atividade.docinhosCoco,
                    atividade.follow_up,
                    atividade.clienteId,
                    atividade.total_docinhos
                );
            }
            return null;
        });
    }

    async obterTodos(skip: number, limit: number): Promise<Atividade[]> {
        return MongoDB.trackOperation('find', 'atividades', async () => {
            const atividades = await AtividadeModel.find().skip(skip).limit(limit).lean();
            return atividades.map(atividade => new Atividade(
                atividade.id,
                atividade.vendedorId,
                atividade.data,
                atividade.docinhosCoco,
                atividade.follow_up,
                atividade.clienteId,
                atividade.total_docinhos
            ));
        });
    }

    async obterTotal(): Promise<number> {
        return MongoDB.trackOperation('countDocuments', 'atividades', async () => {
            return await AtividadeModel.countDocuments();
        });
    }

    async obterPorVendedorId(vendedorId: string): Promise<Atividade[]> {
        return MongoDB.trackOperation('find', 'atividades', async () => {
            const atividades = await AtividadeModel.find({ vendedorId }).lean();
            return atividades.map(atividade => new Atividade(
                atividade.id,
                atividade.vendedorId,
                atividade.data,
                atividade.docinhosCoco,
                atividade.follow_up,
                atividade.clienteId,
                atividade.total_docinhos
            ));
        });
    }

    async atualizar(id: string, dados: Partial<Atividade>): Promise<Atividade | null> {
        return MongoDB.trackOperation('findByIdAndUpdate', 'atividades', async () => {
            const atividadeAtualizada = await AtividadeModel.findByIdAndUpdate(
                id,
                dados,
                { new: true }
            ).lean();

            if (atividadeAtualizada) {
                return new Atividade(
                    atividadeAtualizada.id,
                    atividadeAtualizada.vendedorId,
                    atividadeAtualizada.data,
                    atividadeAtualizada.docinhosCoco,
                    atividadeAtualizada.follow_up,
                    atividadeAtualizada.clienteId,
                    atividadeAtualizada.total_docinhos
                );
            }
            return null;
        });
    }

    async obterPorVendedorEData(vendedorId: string, dataInicio: Date, dataFim: Date): Promise<Atividade[]> {
        return MongoDB.trackOperation('find', 'atividades', async () => {
            console.log('Debug - Repository - Query params:', {
                vendedorId,
                dataInicio,
                dataFim
            });

            const query = {
                vendedorId,
                data: {
                    $gte: dataInicio.setHours(0, 0, 0, 0),
                    $lte: dataFim.setHours(23, 59, 59, 999)
                }
            };

            console.log('Debug - Repository - MongoDB query:', query);

            const resultado = await AtividadeModel.find(query).lean();
            
            console.log('Debug - Repository - Resultado encontrado:', resultado);
            
            return resultado.map(atividade => new Atividade(
                atividade.id,
                atividade.vendedorId,
                atividade.data,
                atividade.docinhosCoco,
                atividade.follow_up,
                atividade.clienteId,
                atividade.total_docinhos
            ));
        });
    }

    async deletar(id: string): Promise<void> {
        await MongoDB.trackOperation('findByIdAndDelete', 'atividades', async () => {
            await AtividadeModel.findByIdAndDelete(id);
        });
    }

    async deletarTodos(): Promise<void> {
        await MongoDB.trackOperation('deleteMany', 'atividades', async () => {
            await AtividadeModel.deleteMany({});
        });
    }
}