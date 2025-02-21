import { Vendedor } from "../../domain/entities/Vendedor";
import { VendedorRepository } from "../../domain/repositories/VendedorRepository";
import { VendedorModel } from "../database/models/VendedorModel";
import { EquipeModel } from "../database/models/EquipeModel";

export class VendedorRepositoryImpl implements VendedorRepository {
    async criar(vendedor: Vendedor): Promise<void> {
        await VendedorModel.create(vendedor);
    }

    async obterPorId(id: string): Promise<Vendedor | null> {
        const vendedor = await VendedorModel.findOne({ id }).lean();
        if (vendedor) {
            const equipe = await EquipeModel.findOne({ id: vendedor.equipe_id }).lean();
            return new Vendedor(vendedor.id, vendedor.nome, vendedor.equipe_id, equipe ? { id: equipe.id, nome: equipe.nome } : null);
        }
        return null;
    }

    async obterTodos(skip: number, limit: number): Promise<Vendedor[]> {
        const vendedores = await VendedorModel.find().skip(skip).limit(limit).lean();
        return await Promise.all(vendedores.map(async (vendedor) => {
            const equipe = await EquipeModel.findOne({ id: vendedor.equipe_id }).lean();
            return new Vendedor(vendedor.id, vendedor.nome, vendedor.equipe_id, equipe ? { id: equipe.id, nome: equipe.nome } : null);
        }));
    }

    async obterPorEquipeId(equipeId: string): Promise<Vendedor[]> {
        const vendedores = await VendedorModel.find({ equipe_id: equipeId }).lean();
        return await Promise.all(vendedores.map(async (vendedor) => {
            const equipe = await EquipeModel.findOne({ id: vendedor.equipe_id }).lean();
            return new Vendedor(vendedor.id, vendedor.nome, vendedor.equipe_id, equipe ? { id: equipe.id, nome: equipe.nome } : null);
        }));
    }
}