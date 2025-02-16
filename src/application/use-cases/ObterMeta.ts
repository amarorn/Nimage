import { Meta } from "../../domain/entities/Meta";
import { MetaRepository } from "../../domain/repositories/MetaRepository";

export class ObterMeta {
    constructor(private metaRepo: MetaRepository) {}

    async executar(equipeId: string): Promise<Meta | null> {
        return await this.metaRepo.obterPorEquipe(equipeId);
    }
}