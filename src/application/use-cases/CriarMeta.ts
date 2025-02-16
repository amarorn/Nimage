import { Meta } from "../../domain/entities/Meta";
import { MetaRepository } from "../../domain/repositories/MetaRepository";

export class CriarMeta {
    constructor(private metaRepo: MetaRepository) {}

    async executar(dados: { id: string; equipeId: string; objetivo: number }) {
        const meta = new Meta(dados.id, dados.equipeId, dados.objetivo);
        await this.metaRepo.criar(meta);
        return meta;
    }
}