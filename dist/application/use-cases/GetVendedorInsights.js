"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVendedorInsights = void 0;
const InsightsRepositoryImpl_1 = require("../../infrastructure/repositories/InsightsRepositoryImpl");
class GetVendedorInsights {
    constructor(vendedorRepository, equipeRepository, atividadeRepository, metaRepository, ollamaService, atividadeService, frequenciaVendasService) {
        this.vendedorRepository = vendedorRepository;
        this.equipeRepository = equipeRepository;
        this.atividadeRepository = atividadeRepository;
        this.metaRepository = metaRepository;
        this.ollamaService = ollamaService;
        this.atividadeService = atividadeService;
        this.frequenciaVendasService = frequenciaVendasService;
        this.insightsRepository = new InsightsRepositoryImpl_1.InsightsRepositoryImpl();
    }
    async execute(vendedorId, mes) {
        try {
            console.log('🔍 Iniciando busca de insights para vendedor:', vendedorId, 'mês:', mes);
            // Verifica se já existem insights recentes no MongoDB
            console.log('🔄 Verificando cache de insights...');
            const insightsRecentes = await this.insightsRepository.obterInsightsMaisRecentes(vendedorId, mes || this.getMesAtual());
            if (insightsRecentes) {
                console.log('✅ Insights encontrados no cache e válidos');
                console.log('📊 Dados do cache:', {
                    dataConsulta: insightsRecentes.dataConsulta,
                    mesReferencia: insightsRecentes.mesReferencia
                });
                return insightsRecentes.dados;
            }
            console.log('⚠️ Cache não encontrado ou expirado. Gerando novos insights...');
            // Busca dados do vendedor
            console.log('🔍 Buscando dados do vendedor...');
            const vendedor = await this.vendedorRepository.obterPorId(vendedorId);
            if (!vendedor) {
                console.error('❌ Vendedor não encontrado');
                throw new Error('Vendedor não encontrado');
            }
            console.log('✅ Vendedor encontrado:', vendedor);
            // Busca dados da equipe
            console.log('🔍 Buscando dados da equipe...');
            const equipe = await this.equipeRepository.obterPorId(vendedor.equipeId);
            if (!equipe) {
                console.error('❌ Equipe não encontrada');
                throw new Error('Equipe não encontrada');
            }
            console.log('✅ Equipe encontrada:', equipe);
            // Calcula datas para análise
            console.log('📅 Calculando datas para análise...');
            const datas = this.calcularDatasAnalise(mes);
            console.log('📅 Datas calculadas:', datas);
            // Busca meta da equipe
            console.log('🔍 Buscando metas da equipe...');
            const meta = await this.metaRepository.obterPorEquipeEData(equipe.id, datas.dataInicio, datas.dataFim);
            const metaAnterior = await this.metaRepository.obterPorEquipeEData(equipe.id, datas.mesAnteriorInicio, datas.mesAnteriorFim);
            console.log('🎯 Metas encontradas:', { meta, metaAnterior });
            // Busca atividades do vendedor
            console.log('🔍 Buscando atividades do vendedor...');
            const atividades = await this.atividadeRepository.obterPorVendedorEData(vendedorId, datas.dataInicio, datas.dataFim);
            console.log('📊 Atividades encontradas:', atividades.length);
            // Busca atividades do mês anterior
            console.log('🔍 Buscando atividades do mês anterior...');
            const atividadesMesAnterior = await this.atividadeRepository.obterPorVendedorEData(vendedorId, datas.mesAnteriorInicio, datas.mesAnteriorFim);
            console.log('📊 Atividades mês anterior encontradas:', atividadesMesAnterior.length);
            // Calcula métricas
            console.log('📊 Calculando métricas...');
            const metricas = await this.calcularMetricas(vendedor, equipe, atividades, atividadesMesAnterior, meta, metaAnterior, datas);
            console.log('📈 Métricas calculadas:', metricas);
            // Prepara dados para análise
            console.log('🔄 Preparando dados para análise...');
            const vendorInfo = this.prepararDadosAnalise(metricas, mes);
            console.log('🔄 Dados preparados para análise:', vendorInfo);
            // Gera insights
            console.log('🔍 Gerando insights...');
            const insights = await this.ollamaService.getInsights(vendorInfo);
            console.log('🎉 Insights gerados:', insights);
            // Combina os dados formatados com os insights
            const resultadoFinal = Object.assign(Object.assign({}, vendorInfo), { resultado: Object.assign(Object.assign({}, vendorInfo.resultado), { analiseDeCrescimento: Object.assign(Object.assign({}, vendorInfo.resultado.analiseDeCrescimento), { tendencia: insights.tendencia, observacoes: insights.observacoes, recomendacoes: insights.recomendacoes }) }) });
            // Salva os insights no MongoDB
            console.log('💾 Salvando novos insights no MongoDB...');
            await this.insightsRepository.salvarInsights(vendedorId, mes || this.getMesAtual(), resultadoFinal);
            console.log('✅ Novos insights salvos com sucesso!');
            return resultadoFinal;
        }
        catch (error) {
            console.error('❌ Erro ao gerar insights:', error);
            throw error;
        }
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
    async calcularMetricas(vendedor, equipe, atividades, atividadesMesAnterior, meta, metaAnterior, datas) {
        console.log('🔄 Iniciando cálculo de métricas');
        const diasComAtividade = atividades.length;
        const totalDocinhos = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
        const mediaPorDia = diasComAtividade > 0 ? totalDocinhos / diasComAtividade : 0;
        const totalDocinhosMesAnterior = atividadesMesAnterior.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
        // Calcula a média de vendas do vendedor no mês anterior
        const mediaVendedorMesAnterior = atividadesMesAnterior.length > 0
            ? totalDocinhosMesAnterior / atividadesMesAnterior.length
            : 0;
        console.log('📊 Métricas básicas calculadas:', {
            diasComAtividade,
            totalDocinhos,
            mediaPorDia,
            totalDocinhosMesAnterior,
            mediaVendedorMesAnterior
        });
        const vendedoresEquipe = await this.vendedorRepository.obterPorEquipeId(equipe.id);
        const totalVendedores = vendedoresEquipe.length;
        console.log('👥 Vendedores da equipe:', totalVendedores);
        const vendasEquipeMesAnterior = await Promise.all(vendedoresEquipe.map(async (v) => {
            const atividadesVendedor = await this.atividadeRepository.obterPorVendedorEData(v.id, datas.mesAnteriorInicio, datas.mesAnteriorFim);
            return atividadesVendedor.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
        }));
        const totalVendasEquipeMesAnterior = vendasEquipeMesAnterior.reduce((total, valor) => total + valor, 0);
        const mediaEquipeVendas = totalVendasEquipeMesAnterior / totalVendedores;
        console.log('📈 Métricas da equipe calculadas:', {
            totalVendasEquipeMesAnterior,
            mediaEquipeVendas
        });
        const frequencia = await this.frequenciaVendasService.calcularFrequencia(equipe.id, datas.dataInicio, datas.dataFim);
        const fea = await this.atividadeService.calcularFEA(equipe.id, frequencia.totalDiasDisponiveis, frequencia.diasComAtividade);
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
            mediaVendedorMesAnterior,
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
    }
    prepararDadosAnalise(metricas, mesRequisicao) {
        var _a, _b, _c;
        console.log('🔄 Iniciando preparação dos dados para análise');
        const historicoVendas = this.prepararHistoricoVendas(metricas.atividades);
        console.log('📊 Histórico de vendas preparado:', historicoVendas);
        const dadosAnalise = {
            mesRequisicao: mesRequisicao,
            resultado: {
                vendedor: {
                    nome: metricas.vendedor.nome,
                    feaVendedor: metricas.fea,
                    iapVendedor: metricas.iap,
                    numeroDiasComAtividade: metricas.diasComAtividade,
                    somaDocinhos: metricas.totalDocinhos,
                    mediaAtividadePorDia: metricas.mediaPorDia,
                    vendasMesAnterior: metricas.totalVendasEquipeMesAnterior,
                    mediaVendedorMesAnterior: metricas.mediaVendedorMesAnterior,
                    mediaEquipeMesAnterior: metricas.mediaEquipeVendas,
                    totalVendasMesAnterior: metricas.totalDocinhosMesAnterior,
                    periodoAnalise: {
                        inicio: metricas.datas.dataInicio.toISOString(),
                        fim: metricas.datas.dataFim.toISOString()
                    }
                },
                equipe: {
                    meta_atual: ((_a = metricas.meta) === null || _a === void 0 ? void 0 : _a.objetivo) || 0,
                    meta_anterior: ((_b = metricas.metaAnterior) === null || _b === void 0 ? void 0 : _b.objetivo) || 0,
                    meta_sugerida: Math.round(((_c = metricas.meta) === null || _c === void 0 ? void 0 : _c.objetivo) * (1 + (metricas.fea / 100))),
                    totalVendedores: metricas.totalVendedores,
                    mediaEquipe: metricas.mediaEquipeVendas,
                    totalVendasMesAnterior: metricas.totalVendasEquipeMesAnterior,
                    periodoMetaAnterior: {
                        inicio: metricas.datas.mesAnteriorInicio.toISOString(),
                        fim: metricas.datas.mesAnteriorFim.toISOString()
                    }
                },
                analiseDeCrescimento: {
                    mediaMovel7Dias: [],
                    variacaoPercentualMensal: ((metricas.totalVendasEquipeMesAnterior - metricas.totalDocinhos) / metricas.totalDocinhos * 100).toFixed(2) + "%",
                    tendencia: "",
                    observacoes: [],
                    recomendacoes: []
                }
            },
            dadosGrafico: {
                historico: historicoVendas,
                previsao: this.gerarPrevisao(historicoVendas, metricas.mediaPorDia),
                totaldevedas: metricas.totalDocinhos
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
    gerarPrevisao(historicoVendas, mediaPorDia) {
        var _a, _b;
        console.log('🔄 Gerando previsão de vendas...');
        // Pega o último mês do histórico
        const ultimoMes = ((_a = historicoVendas[historicoVendas.length - 1]) === null || _a === void 0 ? void 0 : _a.mes) || 'Janeiro';
        const ultimoValor = ((_b = historicoVendas[historicoVendas.length - 1]) === null || _b === void 0 ? void 0 : _b.valor) || 0;
        // Lista de meses em português
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        // Encontra o índice do último mês
        const ultimoMesIndex = meses.indexOf(ultimoMes);
        // Gera previsão para os próximos 3 meses
        const previsao = [];
        for (let i = 1; i <= 3; i++) {
            const proximoMesIndex = (ultimoMesIndex + i) % 12;
            const proximoMes = meses[proximoMesIndex];
            // Calcula o valor previsto com base na média diária e dias úteis (22)
            const valorPrevisto = Math.round(mediaPorDia * 22 * (1 + (i * 0.1))); // Aumenta 10% a cada mês
            previsao.push({
                mes: proximoMes,
                valor: valorPrevisto,
                detalhes: {
                    mediaDiaria: mediaPorDia,
                    diasUteis: 22,
                    fatorCrescimento: 1 + (i * 0.1)
                }
            });
        }
        console.log('✅ Previsão gerada:', previsao);
        return previsao;
    }
    getMesAtual() {
        const hoje = new Date();
        return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
    }
}
exports.GetVendedorInsights = GetVendedorInsights;
//# sourceMappingURL=GetVendedorInsights.js.map