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

    async obterTotal(): Promise<number> {
        return await AtividadeModel.countDocuments();
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

    async obterPorVendedorEData(vendedorId: string, dataInicio: Date, dataFim: Date): Promise<Atividade[]> {
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
        
        return resultado;
    }

    async deletar(id: string): Promise<void> {
        await AtividadeModel.findByIdAndDelete(id);
    }

    async deletarTodos(): Promise<void> {
        await AtividadeModel.deleteMany({});
    }
}