import { Meta } from "../../domain/entities/Meta";
import { MetaRepository } from "../../domain/repositories/MetaRepository";

export class ObterMeta {
    constructor(private metaRepo: MetaRepository) {}

    async executar(skip: number, limit: number): Promise<Meta[]> {
        console.log("Executando ObterMeta com paginação", { skip, limit });
        return await this.metaRepo.obterTodos(skip, limit);
    }
}