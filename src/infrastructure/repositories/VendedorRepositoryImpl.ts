import { Vendedor } from "../../domain/entities/Vendedor";
import { VendedorRepository } from "../../domain/repositories/VendedorRepository";
import { VendedorModel } from "../database/models/VendedorModel";
import { EquipeModel } from "../database/models/EquipeModel";

export class VendedorRepositoryImpl implements VendedorRepository {
    async criar(vendedor: Vendedor): Promise<void> {
        await VendedorModel.create(vendedor);
    }

    async obterPorId(id: string): Promise<Vendedor | null> {
        console.log('Debug - Repository - Buscando vendedor no banco com ID:', id);
        const vendedor = await VendedorModel.findOne({ id }).lean();
        console.log('Debug - Repository - Resultado da busca no banco:', vendedor);
        
        if (vendedor) {
            console.log('Debug - Repository - Vendedor encontrado, buscando equipe com ID:', vendedor.equipe_id);
            const equipe = await EquipeModel.findOne({ id: vendedor.equipe_id }).lean();
            console.log('Debug - Repository - Resultado da busca da equipe:', equipe);
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

    async atualizar(id: string, dados: { nome: string; equipe_id: string }): Promise<Vendedor | null> {
        const vendedorAtualizado = await VendedorModel.findOneAndUpdate(
            { id },
            { nome: dados.nome, equipe_id: dados.equipe_id },
            { new: true }
        ).lean();

        if (vendedorAtualizado) {
            const equipe = await EquipeModel.findOne({ id: vendedorAtualizado.equipe_id }).lean();
            return new Vendedor(vendedorAtualizado.id, vendedorAtualizado.nome, vendedorAtualizado.equipe_id, equipe ? { id: equipe.id, nome: equipe.nome } : null);
        }
        return null;
    }
}