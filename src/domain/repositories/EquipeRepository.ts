import { Equipe } from "../entities/Equipe";

export interface EquipeRepository {
    criar(equipe: Equipe): Promise<void>;
    atualizar(id: string, dados: {
        nome?: string;
        nomepdv?: string;
        cidade?: string;
        estado?: string;
        gerente?: string;
        contato_gerente?: string;
        capitao?: string;
        contato_capitao?: string;
    }): Promise<Equipe | null>;
    obterPorId(id: string): Promise<Equipe | null>;
    obterTodos(skip: number, limit: number): Promise<Equipe[]>;
    deletar(id: string): Promise<void>;
}