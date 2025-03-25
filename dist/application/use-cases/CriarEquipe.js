"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriarEquipe = void 0;
const Equipe_1 = require("../../domain/entities/Equipe");
class CriarEquipe {
    constructor(equipeRepo) {
        this.equipeRepo = equipeRepo;
    }
    async executar(dados) {
        //console.log("📝 Iniciando criação de equipe com dados:", dados);
        if (!dados.id || !dados.nome || !dados.pdv || !dados.cidade || !dados.estado ||
            !dados.gerenteNome || !dados.gerenteTelefone || !dados.capitaoNome || !dados.capitaoTelefone) {
            throw new Error('Dados inválidos para criar equipe');
        }
        if (dados.nome.trim().length === 0) {
            throw new Error('Nome da equipe não pode estar vazio');
        }
        const equipe = new Equipe_1.Equipe(dados.id, dados.nome, dados.pdv, dados.cidade, dados.estado, dados.gerenteNome, dados.gerenteTelefone, dados.capitaoNome, dados.capitaoTelefone, dados.temaId);
        //console.log("🏗️ Equipe instanciada:", equipe);
        await this.equipeRepo.criar(equipe);
        //console.log("💾 Equipe persistida no banco");
        return equipe;
    }
}
exports.CriarEquipe = CriarEquipe;
//# sourceMappingURL=CriarEquipe.js.map