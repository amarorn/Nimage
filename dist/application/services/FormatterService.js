"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatterService = void 0;
class FormatterService {
    formatVendorData(vendorData) {
        const equipe = vendorData.resultado.equipe;
        const vendedor = vendorData.resultado.vendedor;
        const formattedData = {
            "meta_atual": this.formatNumber(equipe.meta),
            "novaMetaEquipe": this.formatNumber(vendedor.nova_meta_sugerida || equipe.meta),
            "estrategiaDePromoção": vendedor.estrategias_personalizadas || [
                "Marketing digital",
                "CRM",
                "Treinamento de vendedores"
            ],
            "vendedores": [{
                    "vendedorNome": vendedor.nome,
                    "posicionamento": this.determinePositioning(vendedor),
                    "perfil": this.determineProfile(vendedor),
                    "novaMetaVendedor": this.formatNumber(vendedor.nova_meta_sugerida || equipe.meta),
                    "probCrecimentoVendedor": vendedor.probabilidade_crescimento || this.calculateGrowthProbability(vendedor),
                    "fatorAjusteMeta": this.formatNumber(vendedor.fator_ajuste_meta || this.calculateAdjustmentFactor(vendedor), true),
                    "estrategiaDePromoçãoVendedor": vendedor.estrategias_personalizadas || [
                        "Marketing digital",
                        "CRM",
                        "Treinamento de vendedores"
                    ],
                    "recomendações": vendedor.recomendacoes || this.generateRecommendations(vendedor),
                    "metricas": {
                        "diasComAtividade": vendedor.numeroDiasComAtividade,
                        "totalDocinhos": this.formatNumber(vendedor.somaDocinhos),
                        "mediaPorDia": this.formatNumber(vendedor.mediaAtividadePorDia),
                        "fea": this.formatNumber(vendedor.feaVendedor),
                        "iap": this.formatNumber(vendedor.iapVendedor),
                        "eficienciaVendas": this.calculateEfficiency(vendedor),
                        "tendenciaCrescimento": vendedor.projecao_crescimento || this.calculateGrowthTrend(vendedor)
                    },
                    "pontosFortes": vendedor.pontos_fortes || this.identifyStrengths(vendedor),
                    "pontosFracos": vendedor.pontos_fracos || this.identifyWeaknesses(vendedor),
                    "estrategiasPersonalizadas": vendedor.estrategias_personalizadas || this.generatePersonalizedStrategies(vendedor),
                    "dadosGrafico": vendedor.dados_grafico || {
                        historico: Array(6).fill({ mes: "", valor: 0 }),
                        previsao: Array(3).fill({ mes: "", valor: 0 })
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
            meta_atual: modelResponse.meta_atual,
            novaMetaEquipe: modelResponse.novaMetaEquipe,
            estrategiaDePromoção: modelResponse.estrategiaDePromoção,
            vendedores: modelResponse.vendedores.map((vendedor) => ({
                vendedorNome: vendedor.vendedorNome,
                posicionamento: vendedor.posicionamento,
                perfil: vendedor.perfil,
                novaMetaVendedor: vendedor.novaMetaVendedor,
                probCrecimentoVendedor: vendedor.probCrecimentoVendedor,
                fatorAjusteMeta: vendedor.fatorAjusteMeta,
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
}
exports.FormatterService = FormatterService;
