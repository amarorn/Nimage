"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeMetaService = void 0;
const EquipeMetaCacheService_1 = require("../../infrastructure/cache/EquipeMetaCacheService");
class EquipeMetaService {
    constructor(obterEquipeDadosFull) {
        this.obterEquipeDadosFull = obterEquipeDadosFull;
        this.equipeMetaCache = EquipeMetaCacheService_1.EquipeMetaCacheService.getInstance();
    }
    async calcularMeta(equipeId) {
        try {
            // Tenta obter do cache primeiro
            const cacheData = await this.equipeMetaCache.getCalculoMeta(equipeId);
            if (cacheData) {
                console.log('📦 Cache hit: Dados da meta encontrados no cache');
                return cacheData;
            }
            console.log('🔄 Cache miss: Calculando meta...');
            const dadosCompletos = await this.obterEquipeDadosFull.executar(equipeId);
            const somaDocinhosPorVendedor = dadosCompletos.vendedores.map(vendedor => {
                // Agrupa atividades por ano e mês
                const desempenhoPorAnoMes = vendedor.atividades.reduce((acc, atividade) => {
                    const data = new Date(atividade.data);
                    const ano = data.getFullYear();
                    const mes = data.getMonth() + 1; // getMonth() retorna 0-11
                    const nomeMes = data.toLocaleString('pt-BR', { month: 'long' });
                    if (!acc[ano]) {
                        acc[ano] = {};
                    }
                    if (!acc[ano][mes]) {
                        acc[ano][mes] = {
                            nome: nomeMes,
                            dias: {},
                            somaMes: 0
                        };
                    }
                    const dia = data.getDate();
                    if (!acc[ano][mes].dias[dia]) {
                        acc[ano][mes].dias[dia] = 0;
                    }
                    acc[ano][mes].dias[dia] += atividade.docinhosCoco;
                    return acc;
                }, {});
                // Calcula o total geral de docinhos
                const soma = vendedor.atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
                // Adiciona somaMes para cada mês
                Object.keys(desempenhoPorAnoMes).forEach(ano => {
                    Object.keys(desempenhoPorAnoMes[Number(ano)]).forEach(mes => {
                        const somaMes = Object.values(desempenhoPorAnoMes[Number(ano)][Number(mes)].dias).reduce((total, valor) => total + valor, 0);
                        desempenhoPorAnoMes[Number(ano)][Number(mes)].somaMes = somaMes;
                    });
                });
                return {
                    vendedorId: vendedor.id,
                    vendedorNome: vendedor.nome,
                    somaDocinhos: soma,
                    desempenhoPorAnoMes
                };
            });
            const somaTotalDocinhos = somaDocinhosPorVendedor.reduce((total, vendedor) => total + vendedor.somaDocinhos, 0);
            const resultado = {
                equipe: dadosCompletos.equipe,
                meta: dadosCompletos.meta,
                somaDocinhosPorVendedor,
                somaTotalDocinhos
            };
            // Salva no cache
            await this.equipeMetaCache.setCalculoMeta(equipeId, resultado);
            console.log('💾 Cache: Dados da meta salvos no cache');
            return resultado;
        }
        catch (error) {
            console.error('❌ Erro ao calcular meta:', error);
            throw error;
        }
    }
    async invalidarCache(equipeId) {
        try {
            await this.equipeMetaCache.invalidateCalculoMeta(equipeId);
            console.log('🗑️ Cache: Dados da meta invalidados');
        }
        catch (error) {
            console.error('❌ Erro ao invalidar cache da meta:', error);
        }
    }
}
exports.EquipeMetaService = EquipeMetaService;
//# sourceMappingURL=EquipeMetaService.js.map