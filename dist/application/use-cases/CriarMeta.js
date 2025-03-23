"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarMeta = void 0;
const Meta_1 = require("../../domain/entities/Meta");
class CriarMeta {
    constructor(metaRepo) {
        this.metaRepo = metaRepo;
    }
    async executar(dados) {
        //console.log("📝 Iniciando criação de meta com dados:", dados);
        if (!dados.id || !dados.equipeId || dados.objetivo === undefined || !dados.data) {
            throw new Error('Dados inválidos para criar meta');
        }
        if (dados.objetivo < 0) {
            throw new Error('Objetivo não pode ser negativo');
        }
        const meta = new Meta_1.Meta(dados.id, dados.equipeId, dados.objetivo, dados.data);
        //console.log("🏗️ Meta instanciada:", meta);
        await this.metaRepo.criar(meta);
        //console.log("💾 Meta persistida no banco");
        return meta;
    }
}
exports.CriarMeta = CriarMeta;
//# sourceMappingURL=CriarMeta.js.map