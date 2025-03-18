import fetch from 'node-fetch';

export class OllamaService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434/api';
    }

    async getInsights(vendorInfo: any): Promise<any> {
        try {
            if (!vendorInfo || !vendorInfo.resultado) {
                throw new Error('Invalid vendorInfo structure');
            }

            const vendedor = vendorInfo.resultado.vendedor;
            const metaEquipe = vendorInfo.resultado.equipe.meta;

            // Calcula o percentual de contribuição para a meta da equipe
            const percentualContribuicao = (vendedor.somaDocinhos / metaEquipe) * 100;

            // Calcula o peso do vendedor (vendas individuais / total de vendas da equipe)
            const pesoVendedor = percentualContribuicao / 100;

            // Calcula a distribuição da meta baseada no peso do vendedor
            const distribuicaoMeta = pesoVendedor * metaEquipe;

            // Calcula o desempenho diário ideal
            const hoje = new Date();
            const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
            const desempenhoDiarioIdeal = distribuicaoMeta / ultimoDiaMes;

            // Calcula o fator de ajuste de meta baseado no desempenho
            let fatorAjusteMeta = 1.0;
            if (percentualContribuicao > 100) {
                fatorAjusteMeta = 1.2; // Aumenta 20% se superou a meta
            } else if (percentualContribuicao > 80) {
                fatorAjusteMeta = 1.1; // Aumenta 10% se atingiu mais de 80% da meta
            } else if (percentualContribuicao < 50) {
                fatorAjusteMeta = 0.9; // Reduz 10% se não atingiu 50% da meta
            }

            // Calcula a probabilidade de crescimento baseada nas métricas
            let probabilidadeCrescimento = "10% a 20%";
            if (vendedor.feaVendedor > 1.5 && vendedor.iapVendedor > 15000) {
                probabilidadeCrescimento = "30% a 40%";
            } else if (vendedor.feaVendedor > 1.2 && vendedor.iapVendedor > 10000) {
                probabilidadeCrescimento = "20% a 30%";
            }

            const analysisPrompt = `
Analise o desempenho do vendedor ${vendedor.nome} com base nos seguintes dados dos últimos 4 meses:

Métricas Atuais:
- FEA (Fator de Eficiência de Atividade): ${vendedor.feaVendedor}
- IAP (Indicador de Atividade Potencial): ${vendedor.iapVendedor}
- Dias com Atividade: ${vendedor.numeroDiasComAtividade}
- Total de Docinhos Vendidos: ${vendedor.somaDocinhos}
- Média por Dia: ${vendedor.mediaAtividadePorDia}
- Percentual de Contribuição para Meta da Equipe: ${percentualContribuicao.toFixed(2)}%
- Peso do Vendedor na Equipe: ${(pesoVendedor * 100).toFixed(2)}%
- Distribuição da Meta: ${distribuicaoMeta.toFixed(2)}
- Desempenho Diário Ideal: ${desempenhoDiarioIdeal.toFixed(2)}

Meta da Equipe:
- Objetivo: ${metaEquipe}

Por favor, forneça uma análise detalhada incluindo:
1. Perfil de vendas
2. Pontos fortes e fracos
3. Recomendações
4. Projeção de crescimento
5. Probabilidade de crescimento
6. Fator de ajuste de meta

Responda APENAS com o JSON abaixo, sem texto adicional:`;

            const response = await fetch(`${this.baseUrl}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'nimage',
                    prompt: analysisPrompt,
                    stream: false,
                }),
            });
            const result = await response.json();
            
            // Processa a resposta do Ollama
            try {
                const analysis = JSON.parse(result.response);
                vendedor.perfil_vendas = analysis.perfil_vendas;
                vendedor.pontos_fortes = analysis.pontos_fortes;
                vendedor.pontos_fracos = analysis.pontos_fracos;
                vendedor.recomendacoes = analysis.recomendacoes;
                vendedor.projecao_crescimento = analysis.projecao_crescimento;
                vendedor.probabilidade_crescimento = probabilidadeCrescimento;
                vendedor.fator_ajuste_meta = fatorAjusteMeta;
                vendedor.percentual_contribuicao = percentualContribuicao;
                vendedor.peso_vendedor = pesoVendedor;
                vendedor.distribuicao_meta = distribuicaoMeta;
                vendedor.desempenho_diario_ideal = desempenhoDiarioIdeal;
            } catch (error) {
                console.error('Erro ao processar resposta do Ollama:', error);
                // Define valores padrão em caso de erro
                vendedor.perfil_vendas = "Perfil não disponível";
                vendedor.pontos_fortes = ["Pontos fortes não disponíveis"];
                vendedor.pontos_fracos = ["Pontos fracos não disponíveis"];
                vendedor.recomendacoes = ["Recomendações não disponíveis"];
                vendedor.projecao_crescimento = "Projeção não disponível";
                vendedor.probabilidade_crescimento = probabilidadeCrescimento;
                vendedor.fator_ajuste_meta = fatorAjusteMeta;
                vendedor.percentual_contribuicao = percentualContribuicao;
                vendedor.peso_vendedor = pesoVendedor;
                vendedor.distribuicao_meta = distribuicaoMeta;
                vendedor.desempenho_diario_ideal = desempenhoDiarioIdeal;
            }
            
            return vendorInfo;
        } catch (error) {
            console.error('Error fetching insights from Ollama:', error);
            throw error;
        }
    }

    public determinePositioning(vendedor: any): string {
        if (vendedor.iapVendedor > 30000 && vendedor.feaVendedor > 900) {
            return "Top Performer";
        } else if (vendedor.iapVendedor > 20000 && vendedor.feaVendedor > 500) {
            return "Intermediário";
        } else {
            return "Baixa Frequência";
        }
    }

    public determineProfile(vendedor: any): string {
        if (vendedor.iapVendedor > 30000 && vendedor.feaVendedor > 900) {
            return "Performático";
        } else if (vendedor.iapVendedor > 20000 && vendedor.feaVendedor > 500) {
            return "Intermediário";
        } else {
            return "Iniciante";
        }
    }

    public async trainModel(example: { prompt: string; completion: string }): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/tune`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'nimage',
                    prompt: example.prompt,
                    response: example.completion
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao treinar modelo: ${response.statusText}`);
            }

            console.log('✅ Exemplo treinado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao treinar exemplo:', error);
            throw error;
        }
    }
}