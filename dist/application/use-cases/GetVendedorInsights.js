"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVendedorInsights = void 0;
class GetVendedorInsights {
    constructor(vendedorRepository, equipeRepository, atividadeRepository, metaRepository, ollamaService, atividadeService, frequenciaVendasService) {
        this.vendedorRepository = vendedorRepository;
        this.equipeRepository = equipeRepository;
        this.atividadeRepository = atividadeRepository;
        this.metaRepository = metaRepository;
        this.ollamaService = ollamaService;
        this.atividadeService = atividadeService;
        this.frequenciaVendasService = frequenciaVendasService;
    }
    execute(vendedorId, mes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔍 Iniciando busca de insights para vendedor:', vendedorId, 'mês:', mes);
                // Busca dados do vendedor
                const vendedor = yield this.vendedorRepository.obterPorId(vendedorId);
                if (!vendedor) {
                    throw new Error('Vendedor não encontrado');
                }
                console.log('✅ Vendedor encontrado:', vendedor);
                // Busca dados da equipe
                const equipe = yield this.equipeRepository.obterPorId(vendedor.equipeId);
                if (!equipe) {
                    throw new Error('Equipe não encontrada');
                }
                console.log('✅ Equipe encontrada:', equipe);
                // Calcula datas para análise
                const datas = this.calcularDatasAnalise(mes);
                console.log('📅 Datas calculadas:', datas);
                // Busca meta da equipe
                const meta = yield this.metaRepository.obterPorEquipe(equipe.id);
                const metaAnterior = yield this.metaRepository.obterPorEquipeEData(equipe.id, datas.mesAnteriorInicio, datas.mesAnteriorFim);
                console.log('🎯 Metas encontradas:', { meta, metaAnterior });
                // Busca atividades do vendedor
                const atividades = yield this.atividadeRepository.obterPorVendedorEData(vendedorId, datas.dataInicio, datas.dataFim);
                console.log('📊 Atividades encontradas:', atividades.length);
                // Busca atividades do mês anterior
                const atividadesMesAnterior = yield this.atividadeRepository.obterPorVendedorEData(vendedorId, datas.mesAnteriorInicio, datas.mesAnteriorFim);
                console.log('📊 Atividades mês anterior encontradas:', atividadesMesAnterior.length);
                // Calcula métricas
                const metricas = yield this.calcularMetricas(vendedor, equipe, atividades, atividadesMesAnterior, meta, metaAnterior, datas);
                console.log('📈 Métricas calculadas:', metricas);
                // Prepara dados para análise
                const vendorInfo = this.prepararDadosAnalise(metricas);
                console.log('🔄 Dados preparados para análise:', vendorInfo);
                // Gera insights
                const insights = yield this.ollamaService.getInsights(vendorInfo);
                console.log('🎉 Insights gerados:', insights);
                return insights;
            }
            catch (error) {
                console.error('❌ Erro ao gerar insights:', error);
                throw error;
            }
        });
    }
    calcularDatasAnalise(mes) {
        let dataInicio;
        let dataFim;
        let mesAnteriorInicio;
        let mesAnteriorFim;
        if (mes) {
            // Se um mês específico foi fornecido (formato: YYYY-MM)
            const [ano, mesNum] = mes.split('-').map(Number);
            dataInicio = new Date(ano, mesNum - 1, 1);
            dataFim = new Date(ano, mesNum, 0); // Último dia do mês
            mesAnteriorInicio = new Date(ano, mesNum - 2, 1);
            mesAnteriorFim = new Date(ano, mesNum - 1, 0);
        }
        else {
            // Se nenhum mês foi fornecido, usa o mês atual
            const hoje = new Date();
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            mesAnteriorInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
            mesAnteriorFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
        }
        // Ajusta as horas para considerar o dia inteiro
        dataInicio.setHours(0, 0, 0, 0);
        dataFim.setHours(23, 59, 59, 999);
        mesAnteriorInicio.setHours(0, 0, 0, 0);
        mesAnteriorFim.setHours(23, 59, 59, 999);
        return {
            dataInicio,
            dataFim,
            mesAnteriorInicio,
            mesAnteriorFim
        };
    }
    calcularMetricas(vendedor, equipe, atividades, atividadesMesAnterior, meta, metaAnterior, datas) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('🔄 Iniciando cálculo de métricas');
            const diasComAtividade = atividades.length;
            const totalDocinhos = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
            const mediaPorDia = diasComAtividade > 0 ? totalDocinhos / diasComAtividade : 0;
            const totalDocinhosMesAnterior = atividadesMesAnterior.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
            console.log('📊 Métricas básicas calculadas:', {
                diasComAtividade,
                totalDocinhos,
                mediaPorDia,
                totalDocinhosMesAnterior
            });
            const vendedoresEquipe = yield this.vendedorRepository.obterPorEquipeId(equipe.id);
            const totalVendedores = vendedoresEquipe.length;
            console.log('👥 Vendedores da equipe:', totalVendedores);
            const vendasEquipeMesAnterior = yield Promise.all(vendedoresEquipe.map((v) => __awaiter(this, void 0, void 0, function* () {
                const atividadesVendedor = yield this.atividadeRepository.obterPorVendedorEData(v.id, datas.mesAnteriorInicio, datas.mesAnteriorFim);
                return atividadesVendedor.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
            })));
            const totalVendasEquipeMesAnterior = vendasEquipeMesAnterior.reduce((total, valor) => total + valor, 0);
            const mediaEquipeVendas = totalVendasEquipeMesAnterior / totalVendedores;
            console.log('📈 Métricas da equipe calculadas:', {
                totalVendasEquipeMesAnterior,
                mediaEquipeVendas
            });
            const frequencia = yield this.frequenciaVendasService.calcularFrequencia(equipe.id, datas.dataInicio, datas.dataFim);
            const fea = yield this.atividadeService.calcularFEA(equipe.id, frequencia.totalDiasDisponiveis, frequencia.diasComAtividade);
            const iap = mediaPorDia * (frequencia.totalDiasDisponiveis - diasComAtividade);
            console.log('📊 Indicadores calculados:', {
                frequencia,
                fea,
                iap
            });
            return {
                vendedor,
                equipe,
                diasComAtividade,
                totalDocinhos,
                mediaPorDia,
                totalDocinhosMesAnterior,
                totalVendedores,
                totalVendasEquipeMesAnterior,
                mediaEquipeVendas,
                fea,
                iap,
                meta,
                metaAnterior,
                datas,
                atividades
            };
        });
    }
    prepararDadosAnalise(metricas) {
        var _a, _b;
        console.log('🔄 Iniciando preparação dos dados para análise');
        const historicoVendas = this.prepararHistoricoVendas(metricas.atividades);
        console.log('📊 Histórico de vendas preparado:', historicoVendas);
        const dadosAnalise = {
            resultado: {
                vendedor: {
                    nome: metricas.vendedor.nome,
                    feaVendedor: metricas.fea,
                    iapVendedor: metricas.iap,
                    numeroDiasComAtividade: metricas.diasComAtividade,
                    somaDocinhos: metricas.totalDocinhos,
                    mediaAtividadePorDia: metricas.mediaPorDia,
                    historicoVendas,
                    vendasMesAnterior: metricas.totalDocinhosMesAnterior,
                    mediaEquipeMesAnterior: metricas.mediaEquipeVendas,
                    totalVendedores: metricas.totalVendedores,
                    totalVendasEquipeMesAnterior: metricas.totalVendasEquipeMesAnterior,
                    periodoAnalise: {
                        inicio: metricas.datas.dataInicio.toISOString(),
                        fim: metricas.datas.dataFim.toISOString()
                    }
                },
                equipe: {
                    meta: ((_a = metricas.meta) === null || _a === void 0 ? void 0 : _a.objetivo) || 0,
                    meta_anterior: ((_b = metricas.metaAnterior) === null || _b === void 0 ? void 0 : _b.objetivo) || 0,
                    totalVendedores: metricas.totalVendedores,
                    mediaEquipe: metricas.mediaEquipeVendas,
                    totalVendasMesAnterior: metricas.totalVendasEquipeMesAnterior,
                    periodoMetaAnterior: {
                        inicio: metricas.datas.mesAnteriorInicio.toISOString(),
                        fim: metricas.datas.mesAnteriorFim.toISOString()
                    }
                }
            }
        };
        console.log('✅ Dados preparados para análise:', dadosAnalise);
        return dadosAnalise;
    }
    prepararHistoricoVendas(atividades) {
        console.log('🔄 Iniciando preparação do histórico de vendas');
        const historicoVendas = atividades.map(atividade => {
            const data = new Date(atividade.data);
            const mes = data.toLocaleString('pt-BR', { month: 'long' });
            const dia = data.getDate();
            const ano = data.getFullYear();
            return {
                mes: mes.charAt(0).toUpperCase() + mes.slice(1),
                dia: dia,
                ano: ano,
                valor: atividade.docinhosCoco,
                data: data // Mantém a data completa para ordenação
            };
        });
        // Ordena por data completa
        historicoVendas.sort((a, b) => a.data.getTime() - b.data.getTime());
        // Remove os campos extras antes de retornar
        const historicoFormatado = historicoVendas.map(({ mes, dia, valor }) => ({
            mes,
            dia,
            valor
        }));
        console.log('✅ Histórico de vendas preparado:', historicoFormatado);
        return historicoFormatado;
    }
}
exports.GetVendedorInsights = GetVendedorInsights;
//# sourceMappingURL=GetVendedorInsights.js.map