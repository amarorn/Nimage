"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatterService = void 0;
class FormatterService {
    formatVendorData(vendorData) {
        console.log("🚀 ~ FormatterService ~ formatVendorData ~ vendorData:", vendorData);
        console.log("📅 Mês da Requisição:", vendorData.mesRequisicao);
        const equipe = vendorData.resultado.equipe;
        const vendedor = vendorData.resultado.vendedor;
        const mesRequisicao = vendorData.mesRequisicao;
        if (!mesRequisicao) {
            console.error("❌ Mês da requisição não fornecido!");
            throw new Error("Mês da requisição é obrigatório");
        }
        // Calcula os próximos dois meses
        const [ano, mes] = mesRequisicao.split('-').map(Number);
        const dataBase = new Date(ano, mes - 1, 1);
        const nextMonth = new Date(dataBase);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const followingMonth = new Date(dataBase);
        followingMonth.setMonth(followingMonth.getMonth() + 2);
        // Formata os nomes dos meses em português
        const formatarMes = (data) => {
            return data.toLocaleDateString('pt-BR', { month: 'long' });
        };
        const nextMonthName = formatarMes(nextMonth);
        const followingMonthName = formatarMes(followingMonth);
        // Calcula crescimento da meta e vendas
        const crescimentoMeta = ((equipe.meta_atual - equipe.meta_anterior) / equipe.meta_anterior) * 100;
        const crescimentoVendas = ((vendedor.totalVendasMesAnterior - vendedor.somaDocinhos) / vendedor.somaDocinhos) * 100;
        const diferenca = equipe.meta_atual - equipe.meta_anterior;
        // Calcula média móvel de 7 dias
        const mediaMovel7Dias = this.calcularMediaMovel(vendedor.historicoVendas);
        // Gera previsão detalhada
        const previsaoDetalhada = this.gerarPrevisaoDetalhada(vendedor.somaDocinhos);
        const formattedData = {
            resultado: {
                vendedor: {
                    nome: vendedor.nome,
                    feaVendedor: vendedor.feaVendedor,
                    iapVendedor: vendedor.iapVendedor,
                    numeroDiasComAtividade: vendedor.numeroDiasComAtividade,
                    somaDocinhos: vendedor.somaDocinhos,
                    mediaAtividadePorDia: vendedor.mediaAtividadePorDia,
                    percentualContribuicao: this.formatPercentage(vendedor.percentualContribuicao),
                    percentualCrescimento: crescimentoVendas.toFixed(2),
                    pesoNaEquipe: (100 / equipe.totalVendedores).toFixed(2),
                    distribuicaoMeta: (equipe.meta_atual / equipe.totalVendedores).toFixed(2),
                    desempenhoDiarioIdeal: (equipe.meta_atual / equipe.totalVendedores / 22).toFixed(2),
                    equipe: {
                        meta_atual: equipe.meta_atual,
                        meta_anterior: equipe.meta_anterior,
                        totalVendedores: equipe.totalVendedores,
                        mediaEquipe: equipe.mediaEquipe,
                        totalVendasMesAnterior: equipe.totalVendasMesAnterior,
                        crescimentoMeta: crescimentoMeta.toFixed(2) + "%",
                        crescimentoVendas: crescimentoVendas.toFixed(2) + "%",
                        diferenca: diferenca.toFixed(2),
                        periodoMetaAnterior: {
                            inicio: equipe.periodoMetaAnterior.inicio,
                            fim: equipe.periodoMetaAnterior.fim
                        }
                    }
                }
            },
            dadosGrafico: {
                analiseDeCrescimento: {
                    mediaMovel7Dias,
                    variacaoPercentualMensal: crescimentoVendas.toFixed(2) + "%",
                    tendencia: "Estabilização com viés de recuperação nos últimos dias",
                    observacoes: [
                        "Após queda acentuada no início do mês, houve retomada gradual na reta final.",
                        "Volume de vendas mais consistente nas semanas finais, indicando possível reação."
                    ],
                    recomendacoes: [
                        "Manter o ritmo dos últimos dias e reforçar atuação em dias úteis.",
                        "Avaliar quais ações geraram aumento no final do mês e replicar."
                    ]
                },
                historico: vendedor.historicoVendas,
                previsao: [
                    {
                        mes: nextMonthName.charAt(0).toUpperCase() + nextMonthName.slice(1),
                        valor: Math.round(vendedor.somaDocinhos * 1.1),
                        detalhes: previsaoDetalhada
                    },
                    {
                        mes: followingMonthName.charAt(0).toUpperCase() + followingMonthName.slice(1),
                        valor: Math.round(vendedor.somaDocinhos * 1.2),
                        detalhes: previsaoDetalhada
                    }
                ]
            }
        };
        console.log("🚀 ~ FormatterService ~ formatVendorData ~ formattedData:", formattedData);
        return formattedData;
    }
    calcularMediaMovel(historico) {
        const mediaMovel = [];
        const dias = [7, 14, 21, 28];
        for (const dia of dias) {
            if (historico.length >= dia) {
                const valores = historico.slice(-dia).map(h => h.valor);
                const media = valores.reduce((a, b) => a + b, 0) / dia;
                mediaMovel.push({
                    dia,
                    media: Math.round(media)
                });
            }
        }
        return mediaMovel;
    }
    gerarPrevisaoDetalhada(valorBase) {
        const detalhes = [];
        const diasUteis = 22;
        const valorDiario = valorBase / diasUteis;
        for (let dia = 1; dia <= diasUteis; dia++) {
            const variacao = 0.8 + Math.random() * 0.4; // Variação de ±20%
            detalhes.push({
                dia,
                valor: Math.round(valorDiario * variacao)
            });
        }
        return detalhes;
    }
    formatPercentage(value) {
        if (typeof value === 'string') {
            if (value.includes('NaN'))
                return '0.00%';
            if (value.includes('%'))
                return value;
            value = parseFloat(value);
        }
        if (typeof value !== 'number' || isNaN(value)) {
            return '0.00%';
        }
        return (value * 100).toFixed(2) + '%';
    }
}
exports.FormatterService = FormatterService;
//# sourceMappingURL=FormatterService.js.map