import { Equipe } from "../entities/Equipe";

export interface EquipeRepository {
    criar(equipe: Equipe): Promise<void>;
    atualizar(id: string, dados: {
        nome?: string;
        pdv?: string;
        cidade?: string;
        estado?: string;
        gerenteNome?: string;
        gerenteTelefone?: string;
        capitaoNome?: string;
        capitaoTelefone?: string;
        temaId?: string;
    }): Promise<Equipe | null>;
    obterPorId(id: string): Promise<Equipe | null>;
    obterTodos(skip: number, limit: number): Promise<Equipe[]>;
    deletar(id: string): Promise<void>;
    deletarTodos(): Promise<void>;
}