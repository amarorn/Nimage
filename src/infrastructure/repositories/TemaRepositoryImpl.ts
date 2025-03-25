import { Tema } from "../../domain/entities/Tema";
import { TemaRepository } from "../../domain/repositories/TemaRepository";
import { TemaModel } from "../database/models/TemaModel";

export class TemaRepositoryImpl implements TemaRepository {
    async criar(tema: Tema): Promise<void> {
        await TemaModel.create(tema);
    }

    async atualizar(id: string, dados: { nome: string; descricao: string; cor: string }): Promise<Tema | null> {
        const temaAtualizado = await TemaModel.findOneAndUpdate(
            { id },
            { ...dados },
            { new: true }
        ).lean();

        if (temaAtualizado) {
            return new Tema(
                temaAtualizado.id,
                temaAtualizado.nome,
                temaAtualizado.descricao,
                temaAtualizado.cor
            );
        }
        return null;
    }

    async obterPorId(id: string): Promise<Tema | null> {
        const tema = await TemaModel.findOne({ id }).lean();
        if (!tema) return null;

        return new Tema(
            tema.id,
            tema.nome,
            tema.descricao,
            tema.cor
        );
    }

    async obterTodos(skip: number, limit: number): Promise<Tema[]> {
        const temas = await TemaModel.find()
            .skip(skip)
            .limit(limit)
            .lean();

        return temas.map(tema => new Tema(
            tema.id,
            tema.nome,
            tema.descricao,
            tema.cor
        ));
    }

    async deletar(id: string): Promise<void> {
        await TemaModel.deleteOne({ id });
    }

    async obterTotal(): Promise<number> {
        return await TemaModel.countDocuments();
    }
} 