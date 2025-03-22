"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatterService = void 0;
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
class FormatterService {
    formatVendorData(vendorData) {
        console.log("🚀 ~ FormatterService ~ formatVendorData ~ vendorData:", vendorData);
        console.log("📅 Mês da Requisição:", vendorData.mesRequisicao);
        const equipe = vendorData.resultado.equipe;
        const vendedor = vendorData.resultado.vendedor;
        const mesRequisicao = vendorData.mesRequisicao;
        const [ano, mes] = mesRequisicao.split('-').map(Number);
        console.log("📅 Ano:", ano, "Mês:", mes);
        const nextMonthDate = new Date(ano, mes - 1 + 1, 1); // Mês seguinte
        console.log("🚀 Próximo mês:", nextMonthDate);
        const followingMonthDate = new Date(ano, mes - 1 + 2, 1); // Mês subsequente
        console.log("🚀 Mês subsequente:", followingMonthDate);
        if (!mesRequisicao) {
            console.error("❌ Mês da requisição não fornecido!");
            throw new Error("Mês da requisição é obrigatório");
        }
        const formattedData = {
            "meta_anterior": this.formatCurrency(equipe.meta),
            "novaMetaEquipe": this.formatCurrency(equipe.meta),
            "estrategiaDePromoção": [
                "Marketing digital",
                "CRM",
                "Treinamento de vendedores"
            ],
            "vendedores": [{
                    "vendedorNome": vendedor.nome,
                    "posicionamento": this.getPosicionamento(vendedor.feaVendedor),
                    "perfil": this.getProfile(vendedor),
                    "novaMetaVendedor": this.formatNumber(vendedor.nova_meta_sugerida || equipe.meta),
                    "probCrecimentoVendedor": vendedor.probabilidade_crescimento || this.calculateGrowthProbability(vendedor),
                    "fatorAjusteMeta": this.formatNumber(vendedor.fator_ajuste_meta || this.calculateAdjustmentFactor(vendedor), true),
                    "percentualContribuicao": typeof vendedor.percentual_contribuicao === 'string' && vendedor.percentual_contribuicao.includes('NaN') ?
                        "0.00%" : this.formatPercentage(vendedor.percentual_contribuicao / 100 || 0),
                    "pesoVendedor": typeof vendedor.peso_vendedor === 'string' && vendedor.peso_vendedor.includes('NaN') ?
                        "0.00%" : this.formatPercentage(vendedor.peso_vendedor || 0),
                    "distribuicaoMeta": this.formatNumber(vendedor.distribuicao_meta || 0),
                    "desempenhoDiarioIdeal": this.formatNumber(vendedor.desempenho_diario_ideal || 0),
                    "estrategiaDePromoçãoVendedor": vendedor.estrategias_personalizadas || [
                        "Marketing digital",
                        "CRM",
                        "Treinamento de vendedores"
                    ],
                    "recomendações": vendedor.recomendacoes || [],
                    "metricas": {
                        "diasAtivos": vendedor.numeroDiasComAtividade,
                        "totalVendas": this.formatCurrency(vendedor.somaDocinhos),
                        "mediaPorDia": this.formatCurrency(vendedor.mediaAtividadePorDia),
                        "fea": vendedor.feaVendedor.toFixed(2),
                        "iap": this.formatCurrency(vendedor.iapVendedor),
                        "eficienciaVendas": this.formatCurrency(vendedor.mediaAtividadePorDia * 100)
                    },
                    "pontosFortes": vendedor.pontos_fortes || [],
                    "pontosFracos": vendedor.pontos_fracos || [],
                    "estrategiasPersonalizadas": [
                        "Participar de treinamentos específicos",
                        "Aumentar frequência de visitas",
                        "Desenvolver técnicas de vendas consultivas"
                    ],
                    "dadosGrafico": {
                        "historico": vendedor.dadosGrafico.historico || [],
                        "previsao": this.generateDailyForecast(vendedor.somaDocinhos / 6 * 1.2, vendedor.dadosGrafico.historico, mesRequisicao)
                    }
                }]
        };
        console.log("🚀 ~ FormatterService ~ formatVendorData ~ formattedData:", formattedData);
        return this.formatModelResponse(formattedData);
    }
    calculateAdjustmentFactor(vendedor) {
        // Calcula o fator de ajuste com base no desempenho do vendedor
        const baseAdjustment = 0.1; // 10% base
        const feaAdjustment = (vendedor.feaVendedor / 1000) * 0.05; // 5% para cada 1000 de FEA
        const iapAdjustment = (vendedor.iapVendedor / 10000) * 0.05; // 5% para cada 10000 de IAP
        return baseAdjustment + feaAdjustment + iapAdjustment;
    }
    determinePositioning(vendedor) {
        // Implement logic to determine positioning based on IAP and FEA
        if (vendedor.iapVendedor > 30000 && vendedor.feaVendedor > 900) {
            return "Top Performer";
        }
        else if (vendedor.iapVendedor > 20000 && vendedor.feaVendedor > 500) {
            return "Intermediário";
        }
        else {
            return "Baixa Frequência";
        }
    }
    determineProfile(vendedor) {
        // Implement logic to determine profile based on IAP and FEA
        if (vendedor.iapVendedor > 30000 && vendedor.feaVendedor > 900) {
            return "Performático";
        }
        else if (vendedor.iapVendedor > 20000 && vendedor.feaVendedor > 500) {
            return "Intermediário";
        }
        else {
            return "Iniciante";
        }
    }
    calculateGrowthProbability(vendedor) {
        // Implement logic to calculate growth probability
        return "20% a 30%"; // Placeholder
    }
    formatNumber(value, isPercentage = false) {
        if (typeof value !== 'number' || isNaN(value)) {
            console.error(`Invalid number: ${value}`);
            return '0,00'; // Retorna um valor padrão ou lança um erro
        }
        if (isPercentage) {
            value *= 100; // Converte para porcentagem
        }
        return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    generateRecommendations(vendedor) {
        return [
            `Baseado no FEA de ${vendedor.nome}, considere aumentar a frequência de atividades.`,
            `Para melhorar o perfil de ${vendedor.nome}, participe de treinamentos específicos.`,
            `Analise os resultados passados de ${vendedor.nome} para identificar padrões de sucesso.`
        ];
    }
    formatModelResponse(modelResponse) {
        return {
            meta_anterior: modelResponse.meta_anterior,
            novaMetaEquipe: modelResponse.novaMetaEquipe,
            estrategiaDePromoção: modelResponse.estrategiaDePromoção,
            vendedores: modelResponse.vendedores.map((vendedor) => ({
                vendedorNome: vendedor.vendedorNome,
                posicionamento: vendedor.posicionamento,
                perfil: vendedor.perfil,
                novaMetaVendedor: vendedor.novaMetaVendedor,
                probCrecimentoVendedor: vendedor.probCrecimentoVendedor,
                fatorAjusteMeta: vendedor.fatorAjusteMeta,
                percentualContribuicao: vendedor.percentualContribuicao,
                pesoVendedor: vendedor.pesoVendedor,
                distribuicaoMeta: vendedor.distribuicaoMeta,
                desempenhoDiarioIdeal: vendedor.desempenhoDiarioIdeal,
                estrategiaDePromoçãoVendedor: vendedor.estrategiaDePromoçãoVendedor,
                recomendações: vendedor.recomendações,
                metricas: vendedor.metricas,
                pontosFortes: vendedor.pontosFortes,
                pontosFracos: vendedor.pontosFracos,
                estrategiasPersonalizadas: vendedor.estrategiasPersonalizadas,
                dadosGrafico: vendedor.dadosGrafico
            }))
        };
    }
    calculateEfficiency(vendedor) {
        const efficiency = (vendedor.somaDocinhos / (vendedor.numeroDiasComAtividade * vendedor.mediaAtividadePorDia)) * 100;
        return this.formatNumber(efficiency, true);
    }
    calculateGrowthTrend(vendedor) {
        const trend = (vendedor.iapVendedor / vendedor.feaVendedor) * 100;
        if (trend > 150)
            return "Alta";
        if (trend > 100)
            return "Média";
        return "Baixa";
    }
    identifyStrengths(vendedor) {
        return [
            "Boa frequência de vendas",
            "Alto potencial de crescimento",
            "Consistência nas atividades"
        ];
    }
    identifyWeaknesses(vendedor) {
        return [
            "Pode melhorar a média diária",
            "Potencial para aumentar o FEA",
            "Oportunidade de expansão do IAP"
        ];
    }
    generatePersonalizedStrategies(vendedor) {
        return [
            "Participar de treinamentos específicos",
            "Aumentar a frequência de visitas",
            "Desenvolver técnicas de venda consultiva"
        ];
    }
    formatCurrency(value) {
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    formatPercentage(value) {
        if (typeof value === 'string') {
            // Se já for string formatada, verifica se contém NaN
            if (value.includes('NaN'))
                return '0.00%';
            // Se já for string formatada, retorna
            if (value.includes('%'))
                return value;
            // Caso contrário, tenta converter para número
            value = parseFloat(value);
        }
        if (typeof value !== 'number' || isNaN(value)) {
            return '0.00%';
        }
        return (value * 100).toFixed(2) + '%';
    }
    getPosicionamento(fea) {
        if (fea >= 1.5)
            return 'Alta Frequência';
        if (fea >= 1.2)
            return 'Média Frequência';
        return 'Baixa Frequência';
    }
    getProfile(vendedor) {
        if (vendedor.iapVendedor > 30000 && vendedor.feaVendedor > 900) {
            return "Performático";
        }
        else if (vendedor.iapVendedor > 20000 && vendedor.feaVendedor > 500) {
            return "Intermediário";
        }
        else {
            return "Iniciante";
        }
    }
    generateDailyForecast(monthlyValue, historico, mesRequisicao) {
        console.log("📅 Gerando previsão para o mês:", mesRequisicao);
        const dataBase = (0, date_fns_1.parse)(mesRequisicao, 'yyyy-MM', new Date());
        const nextMonth = (0, date_fns_1.addMonths)(dataBase, 1);
        const followingMonth = (0, date_fns_1.addMonths)(dataBase, 2);
        return [
            {
                mes: (0, date_fns_1.format)(nextMonth, 'MMMM', { locale: locale_1.ptBR }),
                valor: Math.round(monthlyValue * 1.1)
            },
            {
                mes: (0, date_fns_1.format)(followingMonth, 'MMMM', { locale: locale_1.ptBR }),
                valor: Math.round(monthlyValue * 1.2)
            }
        ];
    }
}
exports.FormatterService = FormatterService;
//# sourceMappingURL=FormatterService.js.map