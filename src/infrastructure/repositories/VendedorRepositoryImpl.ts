import { Vendedor } from "../../domain/entities/Vendedor";
import { VendedorRepository } from "../../domain/repositories/VendedorRepository";
import { VendedorModel } from "../database/models/VendedorModel";

export class VendedorRepositoryImpl implements VendedorRepository {
    async criar(vendedor: Vendedor): Promise<void> {
        await VendedorModel.create(vendedor);
    }

    async obterPorId(id: string): Promise<Vendedor | null> {
        return await VendedorModel.findOne({ id }).lean();
    }
}