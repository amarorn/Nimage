import fetch from 'node-fetch';
import { AnaliseVendedor, DadosGrafico } from '../../domain/repositories/AnaliseVendedorRepository';

export class OllamaService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434/api';
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async fetchWithRetry(url: string, options: any, maxRetries: number = 3): Promise<any> {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                console.log(`Tentativa ${i + 1} falhou, tentando novamente em 2 segundos...`);
                await this.delay(2000);
            }
        }
    }

    async getInsights(vendorInfo: any): Promise<any> {
        try {
            if (!vendorInfo || !vendorInfo.resultado) {
                throw new Error('Invalid vendorInfo structure');
            }

            const vendedor = vendorInfo.resultado.vendedor;
            const metaEquipe = vendorInfo.resultado.equipe.meta;

            // Log dos dados iniciais para debug
            console.log('Dados do vendedor:', {
                nome: vendedor.nome,
                vendasMesAnterior: vendedor.vendasMesAnterior,
                totalVendasEquipeMesAnterior: vendedor.totalVendasEquipeMesAnterior,
                metaEquipe: metaEquipe,
                metaAnterior: vendorInfo.resultado.equipe.meta_anterior
            });

            // Calcula o percentual de contribuição para a meta da equipe usando dados do mês anterior
            const vendasMesAnterior = parseFloat(vendedor.vendasMesAnterior) || 0;
            const totalVendasEquipeMesAnterior = parseFloat(vendedor.totalVendasEquipeMesAnterior) || 1;
            const metaAnterior = parseFloat(vendorInfo.resultado.equipe.meta_anterior) || 0;
            const metaEquipeNumerico = parseFloat(metaEquipe) || 0;
            
            // Verifica se totalVendasEquipeMesAnterior é zero para evitar divisão por zero
            let percentualContribuicao = 0;
            if (totalVendasEquipeMesAnterior > 0) {
                percentualContribuicao = vendasMesAnterior / totalVendasEquipeMesAnterior;
            }

            // Se o vendedor não tem histórico, usa uma distribuição igualitária
            const temHistorico = vendedor.numeroDiasComAtividade > 0;
            const percentualContribuicao_Final = temHistorico && percentualContribuicao > 0 ? percentualContribuicao : 1 / (vendedor.totalVendedores || 1);

            // Calcula a meta individual do vendedor
            const metaIndividual = percentualContribuicao_Final * metaEquipeNumerico;

            // Formata os valores monetários e percentuais
            const metaIndividualFormatada = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(metaIndividual);

            const percentualContribuicaoFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'percent',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(percentualContribuicao_Final);

            // Prepara dados para análise
            const analysisPrompt = `Você é um assistente especializado em análise de vendedores, treinado para retornar APENAS respostas em formato JSON válido.

Analise o desempenho do vendedor ${vendedor.nome} com base nos seguintes dados:

Métricas:
- FEA: ${vendedor.feaVendedor} (Eficiência das atividades)
- IAP: ${vendedor.iapVendedor} (Potencial de vendas)
- Dias Ativos: ${vendedor.numeroDiasComAtividade}
- Total Vendido: ${vendedor.somaDocinhos}
- Média Diária: ${vendedor.mediaAtividadePorDia}
- Meta Equipe: ${percentualContribuicaoFormatado}
- Meta Individual: ${metaIndividual.toFixed(2)}
- Meta Equipe: ${metaEquipe}

Histórico de Vendas (ordenado por data):
${vendedor.historicoVendas ? JSON.stringify(vendedor.historicoVendas.map((v: { mes: string; dia: number; valor: number }) => `${v.mes} dia ${v.dia}: ${v.valor} vendas`), null, 2) : 'Não disponível'}

Com base nos dados acima, forneça uma análise detalhada e específica. Considere:
1. O FEA de ${vendedor.feaVendedor} indica ${vendedor.feaVendedor > 1.2 ? 'alta' : vendedor.feaVendedor > 0.8 ? 'média' : 'baixa'} eficiência
2. O IAP de ${vendedor.iapVendedor} sugere ${vendedor.iapVendedor > 2000 ? 'alto' : vendedor.iapVendedor > 1000 ? 'médio' : 'baixo'} potencial
3. A contribuição de ${percentualContribuicaoFormatado} da meta da equipe é ${percentualContribuicao > 100 ? 'excelente' : percentualContribuicao > 80 ? 'boa' : 'precisa melhorar'}
4. O histórico mostra ${vendedor.historicoVendas?.length > 0 ? 'vendas consistentes' : 'sem histórico suficiente'}

Retorne APENAS um JSON válido no formato abaixo, sem texto adicional ou explicações:

{
    "perfil_vendas": "Descrição específica do perfil do vendedor baseada nas métricas",
    "tendencias": ["Lista de tendências específicas identificadas no histórico"],
    "pontos_fortes": ["Pontos fortes específicos baseados nas métricas e histórico"],
    "pontos_fracos": ["Pontos fracos específicos baseados nas métricas e histórico"],
    "recomendacoes": ["Recomendações específicas para melhorar o desempenho"],
    "projecao_crescimento": "Projeção específica baseada no histórico e métricas",
    "estrategias_personalizadas": ["Estratégias específicas para este vendedor"],
    "nova_meta_sugerida": ${metaEquipe},
    "probabilidade_crescimento": "${vendedor.feaVendedor > 1.5 && vendedor.iapVendedor > 15000 ? '30% a 40%' : vendedor.feaVendedor > 1.2 && vendedor.iapVendedor > 10000 ? '20% a 30%' : '10% a 20%'}",
    "fator_ajuste_meta": ${percentualContribuicao_Final.toFixed(4)},
    "dados_grafico": {
        "historico": ${JSON.stringify(vendedor.historicoVendas || [])},
        "previsao": [
            {"mes": "Julho", "valor": ${vendedor.mediaAtividadePorDia * 30}},
            {"mes": "Agosto", "valor": ${vendedor.mediaAtividadePorDia * 30 * 1.1}},
            {"mes": "Setembro", "valor": ${vendedor.mediaAtividadePorDia * 30 * 1.2}}
        ]
    },
    "analise_historico": {
        "crescimento_periodo": "Análise específica do crescimento no período",
        "tendencias_identificadas": ["Tendências específicas identificadas no histórico"],
        "pontos_melhoria": ["Pontos específicos que precisam de melhoria"],
        "estrategias_historico": ["Estratégias específicas baseadas no histórico"]
    }
}`;

            const response = await fetch(`${this.baseUrl}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'nimage',
                    prompt: analysisPrompt,
                    stream: false,
                    format: 'json'
                }),
            });
            const result = await response.json();
            
            // Processa a resposta do Ollama
            let analysis: AnaliseVendedor;
            try {
                const cleanResponse = result.response
                    .replace(/\\n/g, '\n')
                    .replace(/\\"/g, '"')
                    .replace(/\\\\/g, '\\')
                    .replace(/\n/g, '')
                    .replace(/\r/g, '')
                    .trim();
                
                const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const jsonStr = jsonMatch[0]
                        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
                        .replace(/:\s*'([^']*)'/g, ':"$1"')
                        .replace(/,\s*}/g, '}')
                        .replace(/,\s*]/g, ']');
                    
                    analysis = JSON.parse(jsonStr);
                } else {
                    throw new Error('Resposta não contém JSON válido');
                }
            } catch (error) {
                console.error('Erro ao processar resposta do Ollama:', error);
                analysis = {
                    perfil_vendas: "Perfil não disponível",
                    tendencias: ["Tendências não disponíveis"],
                    pontos_fortes: ["Pontos fortes não disponíveis"],
                    pontos_fracos: ["Pontos fracos não disponíveis"],
                    recomendacoes: ["Recomendações não disponíveis"],
                    projecao_crescimento: "Projeção não disponível",
                    probabilidade_crescimento: "10% a 20%",
                    fator_ajuste_meta: "0.0000",
                    estrategias_personalizadas: ["Estratégias não disponíveis"],
                    nova_meta_sugerida: metaEquipeNumerico,
                    dados_grafico: {
                        historico: [],
                        previsao: []
                    },
                    analise_historico: {
                        crescimento_periodo: "Análise não disponível",
                        tendencias_identificadas: [],
                        pontos_melhoria: [],
                        estrategias_historico: []
                    }
                };
            }

            // Reorganiza os dados no formato desejado
            return {
                resultado: {
                    vendedor: {
                        nome: vendedor.nome,
                        feaVendedor: Number(vendedor.feaVendedor.toFixed(2)),
                        iapVendedor: vendedor.iapVendedor,
                        percentualContribuicao: percentualContribuicaoFormatado,
                        numeroDiasComAtividade: vendedor.numeroDiasComAtividade,
                        somaDocinhos: vendedor.somaDocinhos,
                        mediaAtividadePorDia: vendedor.mediaAtividadePorDia,
                        metaIndividual: metaIndividualFormatada,
                        vendasMesAnterior: vendedor.vendasMesAnterior,
                        mediaEquipeMesAnterior: vendedor.mediaEquipeMesAnterior,
                        totalVendedores: vendedor.totalVendedores,
                        totalVendasEquipeMesAnterior: vendedor.totalVendasEquipeMesAnterior,
                        equipe: {
                            novaMetaSugerida: Math.round(metaEquipeNumerico),
                            meta: Math.round(metaEquipeNumerico),
                            metaAnterior: Math.round(metaAnterior),
                            totalVendedores: vendedor.totalVendedores,
                            mediaEquipe: vendedor.mediaEquipeMesAnterior,
                            totalVendasMesAnterior: vendedor.totalVendasEquipeMesAnterior,
                            periodoMetaAnterior: vendorInfo.resultado.equipe.periodoMetaAnterior
                        },
                        periodoAnalise: vendedor.periodoAnalise,
                        perfilVendas: analysis.perfil_vendas,
                        tendencias: analysis.tendencias,
                        pontosFortes: analysis.pontos_fortes,
                        pontosFracos: analysis.pontos_fracos,
                        recomendacoes: analysis.recomendacoes,
                        historicoVendas: vendedor.historicoVendas,
                        dadosGrafico: {
                            historico: vendedor.historicoVendas,
                            previsao: analysis.dados_grafico.previsao
                        },
                        analiseHistorico: {
                            crescimentoPeriodo: analysis.analise_historico.crescimento_periodo,
                            tendenciasIdentificadas: analysis.analise_historico.tendencias_identificadas,
                            pontosMelhoria: analysis.analise_historico.pontos_melhoria,
                            estrategiasHistorico: analysis.analise_historico.estrategias_historico
                        }
                    }
                }
            };
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

    public async trainModel({ prompt, completion }: { prompt: string; completion: string }): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/tune`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'nimage',
                    prompt,
                    response: completion
                })
            });

            if (!response.ok) {
                throw new Error(`Erro ao treinar modelo: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erro ao treinar modelo:', error);
            throw error;
        }
    }
}