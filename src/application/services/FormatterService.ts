import { addMonths, format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export class FormatterService {
    formatVendorData(vendorData: any): any {
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
        const formatarMes = (data: Date) => {
            return data.toLocaleDateString('pt-BR', { month: 'long' });
        };

        const nextMonthName = formatarMes(nextMonth);
        const followingMonthName = formatarMes(followingMonth);

        console.log("📅 Nomes dos meses:", {
            proximo: nextMonthName,
            seguinte: followingMonthName
        });

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
                    "previsao": [
                        {
                            mes: nextMonthName.charAt(0).toUpperCase() + nextMonthName.slice(1),
                            valor: Math.round(vendedor.somaDocinhos * 1.1)
                        },
                        {
                            mes: followingMonthName.charAt(0).toUpperCase() + followingMonthName.slice(1),
                            valor: Math.round(vendedor.somaDocinhos * 1.2)
                        }
                    ]
                }
            }]
        };          
        console.log("🚀 ~ FormatterService ~ formatVendorData ~ formattedData:", formattedData)
        return this.formatModelResponse(formattedData);
    }

    private calculateAdjustmentFactor(vendedor: any): number {
        // Calcula o fator de ajuste com base no desempenho do vendedor
        const baseAdjustment = 0.1; // 10% base
        const feaAdjustment = (vendedor.feaVendedor / 1000) * 0.05; // 5% para cada 1000 de FEA
        const iapAdjustment = (vendedor.iapVendedor / 10000) * 0.05; // 5% para cada 10000 de IAP
        return baseAdjustment + feaAdjustment + iapAdjustment;
    }

    private determinePositioning(vendedor: any): string {
        // Implement logic to determine positioning based on IAP and FEA
        if (vendedor.iapVendedor > 30000 && vendedor.feaVendedor > 900) {
            return "Top Performer";
        } else if (vendedor.iapVendedor > 20000 && vendedor.feaVendedor > 500) {
            return "Intermediário";
        } else {
            return "Baixa Frequência";
        }
    }

    private determineProfile(vendedor: any): string {
        // Implement logic to determine profile based on IAP and FEA
        if (vendedor.iapVendedor > 30000 && vendedor.feaVendedor > 900) {
            return "Performático";
        } else if (vendedor.iapVendedor > 20000 && vendedor.feaVendedor > 500) {
            return "Intermediário";
        } else {
            return "Iniciante";
        }
    }

    private calculateGrowthProbability(vendedor: any): string {
        // Implement logic to calculate growth probability
        return "20% a 30%"; // Placeholder
    }

    private formatNumber(value: any, isPercentage: boolean = false): string {
        if (typeof value !== 'number' || isNaN(value)) {
            console.error(`Invalid number: ${value}`);
            return '0,00'; // Retorna um valor padrão ou lança um erro
        }
        if (isPercentage) {
            value *= 100; // Converte para porcentagem
        }
        return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    private generateRecommendations(vendedor: any): string[] {
        return [
            `Baseado no FEA de ${vendedor.nome}, considere aumentar a frequência de atividades.`,
            `Para melhorar o perfil de ${vendedor.nome}, participe de treinamentos específicos.`,
            `Analise os resultados passados de ${vendedor.nome} para identificar padrões de sucesso.`
        ];
    }

    private formatModelResponse(modelResponse: any): any {
        // Calcula os próximos dois meses
        const [ano, mes] = modelResponse.vendedores[0].dadosGrafico.historico[0].mes.split('-').map(Number);
        const dataBase = new Date(ano, mes - 1, 1);
        const nextMonth = new Date(dataBase);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const followingMonth = new Date(dataBase);
        followingMonth.setMonth(followingMonth.getMonth() + 2);

        // Formata os nomes dos meses em português
        const formatarMes = (data: Date) => {
            return data.toLocaleDateString('pt-BR', { month: 'long' });
        };

        const nextMonthName = formatarMes(nextMonth);
        const followingMonthName = formatarMes(followingMonth);

        console.log("📅 Nomes dos meses:", {
            proximo: nextMonthName,
            seguinte: followingMonthName
        });

        const vendedor = modelResponse.vendedores[0];
        const somaDocinhos = vendedor.metricas.totalVendas.replace(/[^0-9]/g, '');

        return {
            meta_anterior: modelResponse.meta_anterior,
            novaMetaEquipe: modelResponse.novaMetaEquipe,
            estrategiaDePromoção: modelResponse.estrategiaDePromoção,
            vendedores: modelResponse.vendedores.map((vendedor: any) => ({
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
                dadosGrafico: {
                    historico: vendedor.dadosGrafico.historico,
                    previsao: [
                        {
                            mes: nextMonthName.charAt(0).toUpperCase() + nextMonthName.slice(1),
                            valor: Math.round(Number(somaDocinhos) * 1.1)
                        },
                        {
                            mes: followingMonthName.charAt(0).toUpperCase() + followingMonthName.slice(1),
                            valor: Math.round(Number(somaDocinhos) * 1.2)
                        }
                    ]
                }
            }))
        };
    }

    private calculateEfficiency(vendedor: any): string {
        const efficiency = (vendedor.somaDocinhos / (vendedor.numeroDiasComAtividade * vendedor.mediaAtividadePorDia)) * 100;
        return this.formatNumber(efficiency, true);
    }

    private calculateGrowthTrend(vendedor: any): string {
        const trend = (vendedor.iapVendedor / vendedor.feaVendedor) * 100;
        if (trend > 150) return "Alta";
        if (trend > 100) return "Média";
        return "Baixa";
    }

    private identifyStrengths(vendedor: any): string[] {
        return [
            "Boa frequência de vendas",
            "Alto potencial de crescimento",
            "Consistência nas atividades"
        ];
    }

    private identifyWeaknesses(vendedor: any): string[] {
        return [
            "Pode melhorar a média diária",
            "Potencial para aumentar o FEA",
            "Oportunidade de expansão do IAP"
        ];
    }

    private generatePersonalizedStrategies(vendedor: any): string[] {
        return [
            "Participar de treinamentos específicos",
            "Aumentar a frequência de visitas",
            "Desenvolver técnicas de venda consultiva"
        ];
    }

    private formatCurrency(value: number): string {
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    private formatPercentage(value: number | string): string {
        if (typeof value === 'string') {
            // Se já for string formatada, verifica se contém NaN
            if (value.includes('NaN')) return '0.00%';
            // Se já for string formatada, retorna
            if (value.includes('%')) return value;
            // Caso contrário, tenta converter para número
            value = parseFloat(value);
        }
        
        if (typeof value !== 'number' || isNaN(value)) {
            return '0.00%';
        }
        return (value * 100).toFixed(2) + '%';
    }

    private getPosicionamento(fea: number): string {
        if (fea >= 1.5) return 'Alta Frequência';
        if (fea >= 1.2) return 'Média Frequência';
        return 'Baixa Frequência';
    }

    private getProfile(vendedor: any): string {
        if (vendedor.iapVendedor > 30000 && vendedor.feaVendedor > 900) {
            return "Performático";
        } else if (vendedor.iapVendedor > 20000 && vendedor.feaVendedor > 500) {
            return "Intermediário";
        } else {
            return "Iniciante";
        }
    }

    private async generateDailyForecast(monthlyValue: number, historico: any[], mesRequisicao: string): Promise<any[]> {
        console.log("📅 Gerando previsão para o mês:", mesRequisicao);
        
        const [ano, mes] = mesRequisicao.split('-').map(Number);
        const dataBase = new Date(ano, mes - 1, 1);
        
        // Calcula os próximos dois meses
        const nextMonth = new Date(dataBase);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        const followingMonth = new Date(dataBase);
        followingMonth.setMonth(followingMonth.getMonth() + 2);

        console.log("📅 Datas calculadas:", {
            dataBase: dataBase.toISOString(),
            nextMonth: nextMonth.toISOString(),
            followingMonth: followingMonth.toISOString()
        });

        // Formata os nomes dos meses em português
        const formatarMes = (data: Date) => {
            return data.toLocaleDateString('pt-BR', { month: 'long' });
        };

        const nextMonthName = formatarMes(nextMonth);
        const followingMonthName = formatarMes(followingMonth);

        console.log("📅 Nomes dos meses:", {
            proximo: nextMonthName,
            seguinte: followingMonthName
        });

        const nextMonthValue = await this.getPredictionFromModel(`
Data: ${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01
Meta atual: ${monthlyValue}
Fator de ajuste: 1.1`, monthlyValue);

        const followingMonthValue = await this.getPredictionFromModel(`
Data: ${followingMonth.getFullYear()}-${String(followingMonth.getMonth() + 1).padStart(2, '0')}-01
Meta atual: ${monthlyValue}
Fator de ajuste: 1.2`, monthlyValue);

        return [
            {
                mes: nextMonthName.charAt(0).toUpperCase() + nextMonthName.slice(1),
                valor: nextMonthValue
            },
            {
                mes: followingMonthName.charAt(0).toUpperCase() + followingMonthName.slice(1),
                valor: followingMonthValue
            }
        ];
    }

    private async getPredictionFromModel(prompt: string, monthlyValue: number): Promise<number> {
        try {
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'nimage',
                    messages: [{ role: 'user', content: prompt }],
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Erro na chamada do modelo: ${response.status}`);
            }

            const result = await response.json();
            return parseInt(result.message.content.trim());
        } catch (error) {
            console.error('Erro ao obter previsão do modelo:', error);
            return Math.round(monthlyValue * 1.1); // Fallback para cálculo simples
        }
    }
}