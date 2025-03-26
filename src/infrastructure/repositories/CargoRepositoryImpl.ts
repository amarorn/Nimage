import { Cargo } from "../../domain/entities/Cargo";
import { CargoRepository } from "../../domain/repositories/CargoRepository";
import { CargoModel } from "../database/models/CargoModel";

export class CargoRepositoryImpl implements CargoRepository {
    async criar(cargo: Cargo): Promise<void> {
        await CargoModel.create(cargo);
    }

    async atualizar(id: string, dados: { nome: string; descricao: string; tag: string }): Promise<Cargo | null> {
        const cargoAtualizado = await CargoModel.findOneAndUpdate(
            { id },
            { ...dados },
            { new: true }
        ).lean();

        if (cargoAtualizado) {
            return new Cargo(
                cargoAtualizado.id,
                cargoAtualizado.nome,
                cargoAtualizado.descricao,
                cargoAtualizado.tag
            );
        }
        return null;
    }

    async obterPorId(id: string): Promise<Cargo | null> {
        const cargo = await CargoModel.findOne({ id }).lean();
        if (!cargo) return null;

        return new Cargo(
            cargo.id,
            cargo.nome,
            cargo.descricao,
            cargo.tag
        );
    }

    async obterTodos(skip: number, limit: number): Promise<Cargo[]> {
        const cargos = await CargoModel.find()
            .skip(skip)
            .limit(limit)
            .lean();

        return cargos.map(cargo => new Cargo(
            cargo.id,
            cargo.nome,
            cargo.descricao,
            cargo.tag
        ));
    }

    async deletar(id: string): Promise<void> {
        await CargoModel.deleteOne({ id });
    }

    async obterTotal(): Promise<number> {
        return await CargoModel.countDocuments();
    }
} 