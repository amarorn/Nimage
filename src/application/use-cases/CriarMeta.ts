import { Meta } from "../../domain/entities/Meta";
import { MetaRepository } from "../../domain/repositories/MetaRepository";

export class CriarMeta {
    constructor(private metaRepo: MetaRepository) {}

    async executar(dados: { 
        id: string; 
        equipeId: string; 
        objetivo: number;
        data: Date;
    }) {
        //console.log("📝 Iniciando criação de meta com dados:", dados);

        if (!dados.id || !dados.equipeId || dados.objetivo === undefined || !dados.data) {
            throw new Error('Dados inválidos para criar meta');
        }

        if (dados.objetivo < 0) {
            throw new Error('Objetivo não pode ser negativo');
        }

        const meta = new Meta(
            dados.id,
            dados.equipeId,
            dados.objetivo,
            dados.data
        );
        //console.log("🏗️ Meta instanciada:", meta);

        await this.metaRepo.criar(meta);
        //console.log("💾 Meta persistida no banco");

        return meta;
    }
}