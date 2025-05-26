"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarAtividade = void 0;
const Atividade_1 = require("../../domain/entities/Atividade");
class CriarAtividade {
    constructor(atividadeRepo) {
        this.atividadeRepo = atividadeRepo;
    }
    async executar(dados) {
        //console.log("📝 Iniciando criação de atividade com dados:", dados);
        if (!dados.id || !dados.vendedorId || !dados.data || dados.docinhosCoco === undefined || dados.follow_up === undefined || !dados.clienteId) {
            throw new Error('Dados inválidos para criar atividade');
        }
        if (dados.docinhosCoco < 0) {
            throw new Error('Quantidade de docinhos não pode ser negativa');
        }
        if (dados.follow_up < 0) {
            throw new Error('Número de follow-ups não pode ser negativo');
        }
        const atividade = new Atividade_1.Atividade(dados.id, dados.vendedorId, dados.data, dados.docinhosCoco, dados.follow_up, dados.clienteId);
        //console.log("🏗️ Atividade instanciada:", atividade);
        await this.atividadeRepo.criar(atividade);
        //console.log("💾 Atividade persistida no banco");
        return atividade;
    }
}
exports.CriarAtividade = CriarAtividade;
//# sourceMappingURL=CriarAtividade.js.map