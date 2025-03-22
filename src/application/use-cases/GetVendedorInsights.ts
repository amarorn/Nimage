import { VendedorRepository } from '../../domain/repositories/VendedorRepository';
import { EquipeRepository } from '../../domain/repositories/EquipeRepository';
import { AtividadeRepository } from '../../domain/repositories/AtividadeRepository';
import { MetaRepository } from '../../domain/repositories/MetaRepository';
import { OllamaService } from '../services/OllamaService';
import { AtividadeService } from '../services/AtividadeService';
import { FrequenciaVendasService } from '../services/FrequenciaVendasService';

export class GetVendedorInsights {
    constructor(
        private vendedorRepository: VendedorRepository,
        private equipeRepository: EquipeRepository,
        private atividadeRepository: AtividadeRepository,
        private metaRepository: MetaRepository,
        private ollamaService: OllamaService,
        private atividadeService: AtividadeService,
        private frequenciaVendasService: FrequenciaVendasService
    ) {}

    async execute(vendedorId: string, mes?: string) {
        try {
            console.log('🔍 Iniciando busca de insights para vendedor:', vendedorId, 'mês:', mes);

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
            const meta = await this.metaRepository.obterPorEquipe(equipe.id);
            const metaAnterior = await this.metaRepository.obterPorEquipeEData(
                equipe.id,
                datas.mesAnteriorInicio,
                datas.mesAnteriorFim
            );
            console.log('🎯 Metas encontradas:', { meta, metaAnterior });

            // Busca atividades do vendedor
            console.log('🔍 Buscando atividades do vendedor...');
            const atividades = await this.atividadeRepository.obterPorVendedorEData(
                vendedorId,
                datas.dataInicio,
                datas.dataFim
            );
            console.log('📊 Atividades encontradas:', atividades.length);

            // Busca atividades do mês anterior
            console.log('🔍 Buscando atividades do mês anterior...');
            const atividadesMesAnterior = await this.atividadeRepository.obterPorVendedorEData(
                vendedorId,
                datas.mesAnteriorInicio,
                datas.mesAnteriorFim
            );
            console.log('📊 Atividades mês anterior encontradas:', atividadesMesAnterior.length);

            // Calcula métricas
            console.log('📊 Calculando métricas...');
            const metricas = await this.calcularMetricas(
                vendedor,
                equipe,
                atividades,
                atividadesMesAnterior,
                meta,
                metaAnterior,
                datas
            );
            console.log('📈 Métricas calculadas:', metricas);

            // Prepara dados para análise
            console.log('🔄 Preparando dados para análise...');
            const vendorInfo = this.prepararDadosAnalise(metricas, mes);
            console.log('🔄 Dados preparados para análise:', vendorInfo);

            // Gera insights
            console.log('🔍 Gerando insights...');
            const insights = await this.ollamaService.getInsights(vendorInfo);
            console.log('🎉 Insights gerados:', insights);

            if (!insights || !insights.resultado || !insights.resultado.vendedor) {
                throw new Error('Formato de insights inválido');
            }

            return insights;
        } catch (error) {
            console.error('❌ Erro ao gerar insights:', error);
            throw error;
        }
    }

    private calcularDatasAnalise(mes?: string) {
        let dataInicio: Date;
        let dataFim: Date;
        let mesAnteriorInicio: Date;
        let mesAnteriorFim: Date;

        if (mes) {
            // Se um mês específico foi fornecido (formato: YYYY-MM)
            const [ano, mesNum] = mes.split('-').map(Number);
            dataInicio = new Date(ano, mesNum - 1, 1);
            dataFim = new Date(ano, mesNum, 0); // Último dia do mês
            mesAnteriorInicio = new Date(ano, mesNum - 2, 1);
            mesAnteriorFim = new Date(ano, mesNum - 1, 0);
        } else {
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

    private async calcularMetricas(
        vendedor: any,
        equipe: any,
        atividades: any[],
        atividadesMesAnterior: any[],
        meta: any,
        metaAnterior: any,
        datas: any
    ) {
        console.log('🔄 Iniciando cálculo de métricas');

        const diasComAtividade = atividades.length;
        const totalDocinhos = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
        const mediaPorDia = diasComAtividade > 0 ? totalDocinhos / diasComAtividade : 0;

        const totalDocinhosMesAnterior = atividadesMesAnterior.reduce(
            (total, atividade) => total + atividade.docinhosCoco,
            0
        );

        console.log('📊 Métricas básicas calculadas:', {
            diasComAtividade,
            totalDocinhos,
            mediaPorDia,
            totalDocinhosMesAnterior
        });

        const vendedoresEquipe = await this.vendedorRepository.obterPorEquipeId(equipe.id);
        const totalVendedores = vendedoresEquipe.length;

        console.log('👥 Vendedores da equipe:', totalVendedores);

        const vendasEquipeMesAnterior = await Promise.all(
            vendedoresEquipe.map(async (v: any) => {
                const atividadesVendedor = await this.atividadeRepository.obterPorVendedorEData(
                    v.id,
                    datas.mesAnteriorInicio,
                    datas.mesAnteriorFim
                );
                return atividadesVendedor.reduce(
                    (total: number, atividade) => total + atividade.docinhosCoco,
                    0
                );
            })
        );

        const totalVendasEquipeMesAnterior = vendasEquipeMesAnterior.reduce(
            (total: number, valor: number) => total + valor,
            0
        );
        const mediaEquipeVendas = totalVendasEquipeMesAnterior / totalVendedores;

        console.log('📈 Métricas da equipe calculadas:', {
            totalVendasEquipeMesAnterior,
            mediaEquipeVendas
        });

        const frequencia = await this.frequenciaVendasService.calcularFrequencia(
            equipe.id,
            datas.dataInicio,
            datas.dataFim
        );
        const fea = await this.atividadeService.calcularFEA(
            equipe.id,
            frequencia.totalDiasDisponiveis,
            frequencia.diasComAtividade
        );
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
    }

    private prepararDadosAnalise(metricas: any, mesRequisicao?: string) {
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
                    meta: metricas.meta?.objetivo || 0,
                    meta_anterior: metricas.metaAnterior?.objetivo || 0,
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

    private prepararHistoricoVendas(atividades: any[]) {
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