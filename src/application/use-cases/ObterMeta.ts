import { Meta } from "../../domain/entities/Meta";
import { MetaRepository } from "../../domain/repositories/MetaRepository";

export class ObterMeta {
    constructor(private metaRepo: MetaRepository) {}

    async executar(skip: number, limit: number): Promise<Meta[]> {
        console.log("Executando ObterMeta com paginação", { skip, limit });
        return await this.metaRepo.obterTodos(skip, limit);
    }

    async executarPorId(id: string): Promise<Meta | null> {
        console.log("Executando ObterMeta por ID", { id });
        return await this.metaRepo.obterPorId(id);
    }

    async executarPorEquipe(equipeId: string): Promise<Meta | null> {
        console.log("Executando ObterMeta por Equipe", { equipeId });
        return await this.metaRepo.obterPorEquipe(equipeId);
    }
}