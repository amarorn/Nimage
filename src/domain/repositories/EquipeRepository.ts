import { Equipe } from "../entities/Equipe";

export interface EquipeRepository {
    criar(equipe: Equipe): Promise<void>;
    atualizar(id: string, dados: { nome: string }): Promise<Equipe | null>;
    obterPorId(id: string): Promise<Equipe | null>;
    obterTodos(skip: number, limit: number): Promise<Equipe[]>;
}