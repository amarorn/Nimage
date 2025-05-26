"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeRepositoryImpl = void 0;
const Equipe_1 = require("../../domain/entities/Equipe");
const EquipeModel_1 = require("../database/models/EquipeModel");
const MongoDB_1 = require("../database/MongoDB");
class EquipeRepositoryImpl {
    async criar(equipe) {
        await MongoDB_1.MongoDB.trackOperation('criar', 'equipes', async () => {
            await EquipeModel_1.EquipeModel.create({
                id: equipe.id,
                nome: equipe.nome,
                pdv: equipe.pdv,
                cidade: equipe.cidade,
                estado: equipe.estado,
                gerenteNome: equipe.gerenteNome,
                gerenteTelefone: equipe.gerenteTelefone,
                capitaoNome: equipe.capitaoNome,
                capitaoTelefone: equipe.capitaoTelefone,
                temaId: equipe.temaId
            });
        });
    }
    async obterPorId(id) {
        console.log(`🔍 Buscando equipe por ID: ${id}`);
        return await MongoDB_1.MongoDB.trackOperation('obterPorId', 'equipes', async () => {
            const equipe = await EquipeModel_1.EquipeModel.findOne({ id });
            if (!equipe) {
                console.log(`❌ Equipe não encontrada: ${id}`);
                return null;
            }
            console.log(`✅ Equipe encontrada: ${id}`);
            return this.toDomain(equipe);
        });
    }
    async obterTodos(skip, limit) {
        console.log(`🔍 Buscando todas as equipes - Skip: ${skip}, Limit: ${limit}`);
        return await MongoDB_1.MongoDB.trackOperation('obterTodos', 'equipes', async () => {
            try {
                console.log('📝 Executando consulta no MongoDB...');
                const equipes = await EquipeModel_1.EquipeModel.findWithPagination(skip, limit);
                console.log(`✅ ${equipes.length} equipes encontradas`);
                console.log('📊 Dados das equipes:', JSON.stringify(equipes, null, 2));
                const equipesConvertidas = equipes.map((equipe) => this.toDomain(equipe));
                console.log('🔄 Equipes convertidas para o domínio:', JSON.stringify(equipesConvertidas, null, 2));
                return equipesConvertidas;
            }
            catch (erro) {
                console.error('❌ Erro ao buscar equipes:', erro);
                throw erro;
            }
        });
    }
    async atualizar(id, dados) {
        console.log(`🔄 Atualizando equipe: ${id}`);
        return await MongoDB_1.MongoDB.trackOperation('atualizar', 'equipes', async () => {
            const equipeAtualizada = await EquipeModel_1.EquipeModel.findOneAndUpdate({ id }, { $set: dados }, { new: true });
            if (!equipeAtualizada) {
                console.log(`❌ Equipe não encontrada para atualização: ${id}`);
                return null;
            }
            console.log(`✅ Equipe atualizada: ${id}`);
            return this.toDomain(equipeAtualizada);
        });
    }
    async deletar(id) {
        console.log(`🗑️ Deletando equipe: ${id}`);
        await MongoDB_1.MongoDB.trackOperation('deletar', 'equipes', async () => {
            await EquipeModel_1.EquipeModel.deleteOne({ id });
            console.log(`✅ Equipe deletada: ${id}`);
        });
    }
    async deletarTodos() {
        console.log('🗑️ Deletando todas as equipes');
        await MongoDB_1.MongoDB.trackOperation('deletarTodos', 'equipes', async () => {
            await EquipeModel_1.EquipeModel.deleteMany({});
            console.log('✅ Todas as equipes foram deletadas');
        });
    }
    async obterTotal() {
        console.log('🔍 Obtendo total de equipes');
        return await MongoDB_1.MongoDB.trackOperation('obterTotal', 'equipes', async () => {
            const total = await EquipeModel_1.EquipeModel.countDocuments();
            console.log(`✅ Total de equipes: ${total}`);
            return total;
        });
    }
    toDomain(equipe) {
        return new Equipe_1.Equipe(equipe.id, equipe.nome, equipe.pdv, equipe.cidade, equipe.estado, equipe.gerenteNome, equipe.gerenteTelefone, equipe.capitaoNome, equipe.capitaoTelefone, equipe.temaId);
    }
}
exports.EquipeRepositoryImpl = EquipeRepositoryImpl;
//# sourceMappingURL=EquipeRepositoryImpl.js.map