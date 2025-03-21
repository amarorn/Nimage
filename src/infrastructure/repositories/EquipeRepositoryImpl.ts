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
                equipe.nomepdv,
                equipe.cidade,
                equipe.estado,
                equipe.gerente,
                equipe.contato_gerente,
                equipe.capitao,
                equipe.contato_capitao
            );
        }
        return null;
    }

    async obterTodos(skip: number, limit: number): Promise<Equipe[]> {
        const equipes = await EquipeModel.find().skip(skip).limit(limit).lean();
        return equipes.map(equipe => new Equipe(
            equipe.id,
            equipe.nome,
            equipe.nomepdv,
            equipe.cidade,
            equipe.estado,
            equipe.gerente,
            equipe.contato_gerente,
            equipe.capitao,
            equipe.contato_capitao
        ));
    }

    async atualizar(id: string, dados: {
        nome?: string;
        nomepdv?: string;
        cidade?: string;
        estado?: string;
        gerente?: string;
        contato_gerente?: string;
        capitao?: string;
        contato_capitao?: string;
    }): Promise<Equipe | null> {
        const equipeAtualizada = await EquipeModel.findOneAndUpdate(
            { id },
            { $set: dados },
            { new: true }
        ).lean();

        if (equipeAtualizada) {
            return new Equipe(
                equipeAtualizada.id,
                equipeAtualizada.nome,
                equipeAtualizada.nomepdv,
                equipeAtualizada.cidade,
                equipeAtualizada.estado,
                equipeAtualizada.gerente,
                equipeAtualizada.contato_gerente,
                equipeAtualizada.capitao,
                equipeAtualizada.contato_capitao
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
}