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
            console.log('Debug - Repository - Vendedor encontrado, buscando equipe com ID:', vendedor.equipeId);
            const equipe = await EquipeModel.findOne({ id: vendedor.equipeId }).lean();
            console.log('Debug - Repository - Resultado da busca da equipe:', equipe);
            return new Vendedor(
                vendedor.id,
                vendedor.nome,
                vendedor.equipeId,
                vendedor.email,
                vendedor.telefone,
                vendedor.meta,
                vendedor.cargo
            );
        }
        return null;
    }

    async obterTodos(skip: number, limit: number): Promise<Vendedor[]> {
        const vendedores = await VendedorModel.find().skip(skip).limit(limit).lean();
        return vendedores.map(vendedor => new Vendedor(
            vendedor.id,
            vendedor.nome,
            vendedor.equipeId,
            vendedor.email,
            vendedor.telefone,
            vendedor.meta,
            vendedor.cargo
        ));
    }

    async obterPorEquipeId(equipeId: string): Promise<Vendedor[]> {
        const vendedores = await VendedorModel.find({ equipeId }).lean();
        return vendedores.map(vendedor => new Vendedor(
            vendedor.id,
            vendedor.nome,
            vendedor.equipeId,
            vendedor.email,
            vendedor.telefone,
            vendedor.meta,
            vendedor.cargo
        ));
    }

    async atualizar(id: string, dados: {
        nome?: string;
        equipeId?: string;
        email?: string;
        telefone?: string;
        meta?: number;
        cargo?: string;
    }): Promise<Vendedor | null> {
        const vendedorAtualizado = await VendedorModel.findOneAndUpdate(
            { id },
            { $set: dados },
            { new: true }
        ).lean();

        if (vendedorAtualizado) {
            return new Vendedor(
                vendedorAtualizado.id,
                vendedorAtualizado.nome,
                vendedorAtualizado.equipeId,
                vendedorAtualizado.email,
                vendedorAtualizado.telefone,
                vendedorAtualizado.meta,
                vendedorAtualizado.cargo
            );
        }
        return null;
    }

    async deletar(id: string): Promise<void> {
        await VendedorModel.deleteOne({ id });
    }
}