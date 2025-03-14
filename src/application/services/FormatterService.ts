export class FormatterService {
    formatVendorData(vendorData: any): any {
        const equipe = vendorData.resultado.equipe;
        const meta = vendorData.resultado.meta;
        const vendedores = vendorData.resultado.frequenciaPorVendedor;

        const formattedData = {
            "meta_atual": this.formatNumber(meta.objetivo),
            "novaMetaEquipe": this.formatNumber(this.calculateNewTeamGoal(equipe)),
            "estrategiaDePromoção": [
                "Marketing digital",
                "CRM",
                "Treinamento de vendedores"
            ],
            "vendedores": vendedores.map((vendedor: any) => ({
                "vendedorNome": vendedor.vendedorNome,
                "posicionamento": this.determinePositioning(vendedor),
                "perfil": this.determineProfile(vendedor),
                "novaMetaVendedor": this.formatNumber(this.calculateNewVendorGoal(vendedor, meta.objetivo)),
                "probCrecimentoVendedor": this.calculateGrowthProbability(vendedor),
                "fatorAjusteMeta": this.formatNumber(this.calculateAdjustmentFactor(vendedor), true),
                "estrategiaDePromoçãoVendedor": [
                    "Marketing digital",
                    "CRM",
                    "Treinamento de vendedores"
                ],
                "recomendações": this.generateRecommendations(vendedor)
            }))
        };
        console.log("🚀 ~ FormatterService ~ formatVendorData ~ formattedData:", formattedData)
        return this.formatModelResponse(formattedData);
    }

    private calculateAdjustmentFactor(vendedor: any): number {
        // Calculate the adjustment factor by dividing IAP by FEA
        return vendedor.iapVendedor / vendedor.feaVendedor;
    }

    private calculateNewTeamGoal(equipe: any): number {
        // Implement logic to calculate new team goal based on equipe data
        return equipe.somaTotalValorAtividades * 1.1; // Example logic
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

    private calculateNewVendorGoal(vendedor: any, metaAtual: number): number {
        // Calculate new vendor goal using the adjustment factor
        const fatorAjuste = this.calculateAdjustmentFactor(vendedor);
        return metaAtual * (1 + fatorAjuste);
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
            `Baseado no FEA de ${vendedor.vendedorNome}, considere aumentar a frequência de atividades.`,
            `Para melhorar o perfil de ${vendedor.vendedorNome}, participe de treinamentos específicos.`,
            `Analise os resultados passados de ${vendedor.vendedorNome} para identificar padrões de sucesso.`
        ];
    }

    private formatModelResponse(modelResponse: any): any {
        return {
            meta_atual: this.formatNumber(modelResponse.meta_atual),
            novaMetaEquipe: this.formatNumber(modelResponse.novaMetaEquipe),
            estrategiaDePromoção: modelResponse.estrategiaDePromoção,
            vendedores: modelResponse.vendedores.map((vendedor: any) => ({
                vendedorNome: vendedor.vendedorNome,
                posicionamento: vendedor.posicionamento,
                perfil: vendedor.perfil,
                novaMetaVendedor: this.formatNumber(vendedor.novaMetaVendedor),
                probCrecimentoVendedor: vendedor.probCrecimentoVendedor,
                fatorAjusteMeta: this.formatNumber(vendedor.fatorAjusteMeta, true),
                estrategiaDePromoçãoVendedor: vendedor.estrategiaDePromoçãoVendedor,
                recomendações: this.generateRecommendations(vendedor)
            }))
        };
    }
} 