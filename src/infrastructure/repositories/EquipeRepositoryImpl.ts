import { Equipe } from "../../domain/entities/Equipe";
import { EquipeRepository } from "../../domain/repositories/EquipeRepository";
import { EquipeModel } from "../database/models/EquipeModel";

export class EquipeRepositoryImpl implements EquipeRepository {
    async criar(equipe: Equipe): Promise<void> {
        await EquipeModel.create(equipe);
    }

    async obterPorId(id: string): Promise<Equipe | null> {
        const equipe = await EquipeModel.findOne({ id }).lean();
        if (equipe) {
            return new Equipe(
                equipe.id,
                equipe.nome,
                equipe.pdv,
                equipe.cidade,
                equipe.estado,
                equipe.gerenteNome,
                equipe.gerenteTelefone,
                equipe.capitaoNome,
                equipe.capitaoTelefone,
                equipe.temaId
            );
        }
        return null;
    }

    async obterTodos(skip: number, limit: number): Promise<Equipe[]> {
        const equipes = await EquipeModel.find().skip(skip).limit(limit).lean();
        return equipes.map(equipe => new Equipe(
            equipe.id,
            equipe.nome,
            equipe.pdv,
            equipe.cidade,
            equipe.estado,
            equipe.gerenteNome,
            equipe.gerenteTelefone,
            equipe.capitaoNome,
            equipe.capitaoTelefone,
            equipe.temaId
        ));
    }

    async atualizar(id: string, dados: {
        nome?: string;
        pdv?: string;
        cidade?: string;
        estado?: string;
        gerenteNome?: string;
        gerenteTelefone?: string;
        capitaoNome?: string;
        capitaoTelefone?: string;
        temaId?: string;
    }): Promise<Equipe | null> {
        const equipeAtualizada = await EquipeModel.findOneAndUpdate(
            { id },
            { ...dados },
            { new: true }
        ).lean();

        if (equipeAtualizada) {
            return new Equipe(
                equipeAtualizada.id,
                equipeAtualizada.nome,
                equipeAtualizada.pdv,
                equipeAtualizada.cidade,
                equipeAtualizada.estado,
                equipeAtualizada.gerenteNome,
                equipeAtualizada.gerenteTelefone,
                equipeAtualizada.capitaoNome,
                equipeAtualizada.capitaoTelefone,
                equipeAtualizada.temaId
            );
        }
        return null;
    }

    async deletar(id: string): Promise<void> {
        await EquipeModel.deleteOne({ id });
    }

    async deletarTodos(): Promise<void> {
        await EquipeModel.deleteMany({});
    }

    async obterTotal(): Promise<number> {
        return await EquipeModel.countDocuments();
    }
}