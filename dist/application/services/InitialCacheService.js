"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialCacheService = void 0;
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const ObterEquipeDadosFull_1 = require("../use-cases/ObterEquipeDadosFull");
const EquipeMetaService_1 = require("./EquipeMetaService");
const AtividadeService_1 = require("./AtividadeService");
const FrequenciaVendasService_1 = require("./FrequenciaVendasService");
const DesempenhoIdealService_1 = require("./DesempenhoIdealService");
class InitialCacheService {
    constructor() {
        this.equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
        this.vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
        this.atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
        this.metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
        this.obterEquipeDadosFull = new ObterEquipeDadosFull_1.ObterEquipeDadosFull(this.equipeRepo, this.vendedorRepo, this.atividadeRepo, this.metaRepo);
        this.equipeMetaService = new EquipeMetaService_1.EquipeMetaService(this.obterEquipeDadosFull);
        this.atividadeService = new AtividadeService_1.AtividadeService(this.atividadeRepo, this.vendedorRepo, this.equipeRepo, this.metaRepo);
        this.frequenciaVendasService = new FrequenciaVendasService_1.FrequenciaVendasService(this.obterEquipeDadosFull);
        this.desempenhoIdealService = new DesempenhoIdealService_1.DesempenhoIdealService();
    }
    async initializeCache() {
        try {
            console.log('🚀 Iniciando cache inicial da aplicação...');
            // Obtém todas as equipes
            const equipes = await this.equipeRepo.obterTodos(0, 1000);
            console.log(`📦 Encontradas ${equipes.length} equipes para cache`);
            // Obtém todas as datas do mês atual
            const hoje = new Date();
            const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            // Para cada equipe, gera o cache dos endpoints
            for (const equipe of equipes) {
                console.log(`🔄 Gerando cache para equipe ${equipe.nome}...`);
                // Cache de calcular-meta
                await this.equipeMetaService.calcularMeta(equipe.id);
                console.log(`✅ Cache de calcular-meta gerado para equipe ${equipe.nome}`);
                // Cache de desempenho-ideal
                await this.desempenhoIdealService.calcularDesempenhoIdeal(equipe.id, hoje.getMonth() + 1, hoje.getFullYear());
                console.log(`✅ Cache de desempenho-ideal gerado para equipe ${equipe.nome}`);
                // Cache de frequencia-vendas
                await this.frequenciaVendasService.calcularFrequencia(equipe.id, primeiroDiaMes, ultimoDiaMes);
                console.log(`✅ Cache de frequencia-vendas gerado para equipe ${equipe.nome}`);
                // Para cada vendedor da equipe
                const vendedores = await this.vendedorRepo.obterPorEquipeId(equipe.id);
                for (const vendedor of vendedores) {
                    // Cache de atividades por vendedor
                    await this.atividadeService.obterAtividadesPorVendedorEData(vendedor.id, primeiroDiaMes, ultimoDiaMes);
                    console.log(`✅ Cache de atividades gerado para vendedor ${vendedor.nome}`);
                }
            }
            // Cache de listas gerais
            await this.atividadeRepo.obterTodos(0, 1000);
            console.log('✅ Cache de atividades/all gerado');
            await this.vendedorRepo.obterTodos(0, 1000);
            console.log('✅ Cache de vendedores/all gerado');
            await this.metaRepo.obterTodos(0, 1000);
            console.log('✅ Cache de metas/all gerado');
            await this.equipeRepo.obterTodos(0, 1000);
            console.log('✅ Cache de equipes/all gerado');
            console.log('✨ Cache inicial da aplicação concluído com sucesso!');
        }
        catch (erro) {
            console.error('❌ Erro ao gerar cache inicial:', erro);
            throw erro;
        }
    }
}
exports.InitialCacheService = InitialCacheService;
//# sourceMappingURL=InitialCacheService.js.map