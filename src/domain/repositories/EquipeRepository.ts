import { Equipe } from "../entities/Equipe";

export interface EquipeRepository {
    criar(equipe: Equipe): Promise<void>;
    obterPorId(id: string): Promise<Equipe | null>;
}