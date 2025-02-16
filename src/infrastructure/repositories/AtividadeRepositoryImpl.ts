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

    async obterPorVendedor(vendedorId: string): Promise<Atividade[]> {
        return await AtividadeModel.find({ vendedorId }).lean();
    }
}