import { Meta } from "../../domain/entities/Meta";
import { MetaRepository } from "../../domain/repositories/MetaRepository";

export class CriarMeta {
    constructor(private metaRepo: MetaRepository) {}

    async executar(dados: { id: string; equipeId: string; objetivo: number }) {
        console.log("📝 Iniciando criação de meta com dados:", dados);

        if (!dados.id || !dados.equipeId || dados.objetivo === undefined) {
            throw new Error('Dados inválidos para criar meta');
        }

        if (dados.objetivo <= 0) {
            throw new Error('Objetivo da meta deve ser maior que zero');
        }

        const meta = new Meta(dados.id, dados.equipeId, dados.objetivo);
        console.log("🏗️ Meta instanciada:", meta);

        await this.metaRepo.criar(meta);
        console.log("💾 Meta persistida no banco");

        return meta;
    }
}