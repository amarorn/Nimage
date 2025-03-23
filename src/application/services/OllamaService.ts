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

            // Calcula o percentual de crescimento
            const iapVendedor = parseFloat(vendedor.iapVendedor) || 0;
            
            // Ajusta o percentual de crescimento para ficar abaixo do percentual de contribuição
            let percentualCrescimento = 0;
            if (vendasMesAnterior > 0) {
                percentualCrescimento = ((iapVendedor - vendasMesAnterior) / vendasMesAnterior) * 100;
                // Limita o percentual de crescimento ao percentual de contribuição
                if (Math.abs(percentualCrescimento) > percentualContribuicao * 100) {
                    percentualCrescimento = percentualCrescimento > 0 ? 
                        percentualContribuicao * 100 * 0.9 : // Se positivo, 90% do percentual de contribuição
                        -percentualContribuicao * 100 * 0.9; // Se negativo, -90% do percentual de contribuição
                }
            }

            // Calcula os próximos dois meses
            const [ano, mes] = vendorInfo.mesRequisicao.split('-').map(Number);
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

            // Prepara o histórico de vendas
            const historico = vendedor.historicoVendas || [];
            console.log('📊 Histórico de vendas:', historico);

            // Calcula a média diária para previsão
            const mediaDiaria = vendedor.mediaAtividadePorDia || 0;
            const diasNoMes = 30; // Assumindo 30 dias para previsão

            // Calcula o crescimento baseado na meta da equipe
            const crescimentoMeta = (metaEquipeNumerico - metaAnterior) / metaAnterior;
            const crescimentoVendas = (vendedor.somaDocinhos - vendasMesAnterior) / vendasMesAnterior;

            // Ajusta o fator de crescimento baseado no desempenho do vendedor em relação à equipe
            const fatorCrescimentoNextMonth = 1 + (crescimentoMeta * 0.5) + (crescimentoVendas * 0.3);
            const fatorCrescimentoFollowingMonth = 1 + (crescimentoMeta * 0.7) + (crescimentoVendas * 0.5);

            // Gera previsão dia a dia para os próximos dois meses
            const previsaoNextMonth = Array.from({ length: diasNoMes }, (_, i) => ({
                dia: i + 1,
                valor: Math.round(mediaDiaria * (1 + (i / diasNoMes) * (fatorCrescimentoNextMonth - 1)))
            }));

            const previsaoFollowingMonth = Array.from({ length: diasNoMes }, (_, i) => ({
                dia: i + 1,
                valor: Math.round(mediaDiaria * (1 + (i / diasNoMes) * (fatorCrescimentoFollowingMonth - 1)))
            }));

            // Retorna o resultado formatado conforme o modelo solicitado
            return {
                resultado: {
                    vendedor: {
                    nome: vendedor.nome,
                    feaVendedor: vendedor.feaVendedor,
                    iapVendedor: vendedor.iapVendedor,
                    numeroDiasComAtividade: vendedor.numeroDiasComAtividade,
                    somaDocinhos: vendedor.somaDocinhos,
                    mediaAtividadePorDia: vendedor.mediaAtividadePorDia,
                        percentualContribuicao: percentualContribuicaoFormatado.replace('%', '').replace(',', '.') + '%',
                    percentualCrescimento: percentualCrescimento.toFixed(2),
                        pesoNaEquipe: (1 / vendedor.totalVendedores * 100).toFixed(2),
                        distribuicaoMeta: metaIndividual.toFixed(2),
                        desempenhoDiarioIdeal: (metaIndividual / 22).toFixed(2),
                        equipe: {
                            meta: metaEquipeNumerico,
                            meta_anterior: metaAnterior,
                            totalVendedores: vendedor.totalVendedores,
                            mediaEquipe: vendedor.mediaEquipeMesAnterior,
                            totalVendasMesAnterior: vendedor.totalVendasEquipeMesAnterior,
                            crescimentoMeta: (crescimentoMeta * 100).toFixed(2) + '%',
                            crescimentoVendas: (crescimentoVendas * 100).toFixed(2) + '%',
                            diferenca: (metaEquipeNumerico - metaAnterior).toFixed(2),
                            periodoMetaAnterior: vendorInfo.resultado.equipe.periodoMetaAnterior
                        },
                    dadosGrafico: {
                            historico: historico,
                            previsao: [
                                {
                                    mes: nextMonthName.charAt(0).toUpperCase() + nextMonthName.slice(1),
                                    valor: previsaoNextMonth.reduce((acc, curr) => acc + curr.valor, 0),
                                    detalhes: previsaoNextMonth
                                },
                                {
                                    mes: followingMonthName.charAt(0).toUpperCase() + followingMonthName.slice(1),
                                    valor: previsaoFollowingMonth.reduce((acc, curr) => acc + curr.valor, 0),
                                    detalhes: previsaoFollowingMonth
                                }
                            ]
                    },
                    analiseHistorico: {
                            crescimentoPeriodo: "Crescimento constante no período analisado",
                            tendenciasIdentificadas: ["Aumento gradual nas vendas"],
                            pontosMelhoria: ["Aumentar volume de vendas"],
                            estrategiasHistorico: ["Foco em produtos principais"]
                        }
                    }
                }
            };
        } catch (error) {
            console.error('Error in getInsights:', error);
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
            const response = await fetch(`${this.baseUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'nimage',
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um analisador de dados de vendas que SEMPRE retorna APENAS JSON válido, sem texto adicional.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        },
                        {
                            role: 'assistant',
                            content: completion
                        }
                    ],
                    stream: false,
                    options: {
                        num_ctx: 8192,
                        temperature: 0.8,
                        top_k: 50,
                        top_p: 0.95,
                        num_thread: 8,
                        repeat_last_n: 128,
                        seed: 42
                    }
                }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao treinar modelo: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Resposta do treinamento:', result);

            // Aguarda um pouco antes do próximo treinamento
            await this.delay(1000);
        } catch (error) {
            console.error('Erro ao treinar modelo:', error);
            throw new Error(`Erro ao treinar modelo: ${(error as Error).message}`);
        }
    }

    private validateAnalysisStructure(analysis: any): boolean {
        const requiredFields = [
            'perfilVendas',
            'tendencias',
            'pontosFracos',
            'pontosFortes',
            'recomendacoes',
            'projecaoCrescimento',
            'probabilidadeCrescimento',
            'fatorAjusteMeta',
            'novaMeta',
            'estrategiasPersonalizadas',
            'historico',
            'previsao'
        ];

        // Verifica campos obrigatórios
        for (const field of requiredFields) {
            if (!analysis[field]) {
                console.error(`❌ Campo obrigatório ausente: ${field}`);
                return false;
            }
        }

        // Verifica arrays
        const arrayFields = ['tendencias', 'pontosFracos', 'pontosFortes', 'recomendacoes', 'estrategiasPersonalizadas'];
        for (const field of arrayFields) {
            if (!Array.isArray(analysis[field]) || analysis[field].length === 0) {
                console.error(`❌ Campo ${field} deve ser um array não vazio`);
                return false;
            }
        }

        // Verifica dados do gráfico
        if (!analysis.historico || !Array.isArray(analysis.historico)) {
            console.error('❌ historico deve ser um array');
            return false;
        }

        if (!analysis.previsao || !Array.isArray(analysis.previsao)) {
            console.error('❌ previsao deve ser um array');
            return false;
        }

        return true;
    }

    private getDefaultAnalysis(metaEquipe: number): AnaliseVendedor {
        return {
            perfilVendas: "Perfil não disponível",
            tendencias: ["Tendências não disponíveis"],
            pontosFortes: ["Pontos fortes não disponíveis"],
            pontosFracos: ["Pontos fracos não disponíveis"],
            recomendacoes: ["Recomendações não disponíveis"],
            projecaoCrescimento: "Projeção não disponível",
            probabilidadeCrescimento: "10% a 20%",
            fatorAjusteMeta: 0,
            novaMeta: metaEquipe,
            estrategiasPersonalizadas: ["Estratégias não disponíveis"],
            historico: [
                {"mes": "Janeiro", "valor": 0},
                {"mes": "Fevereiro", "valor": 0},
                {"mes": "Março", "valor": 0},
                {"mes": "Abril", "valor": 0}
            ],
            previsao: [
                {"mes": "Maio", "valor": 0},
                {"mes": "Junho", "valor": 0}
            ],
            analise_historico: {
                crescimento_periodo: "Análise não disponível",
                tendencias_identificadas: ["Tendências não identificadas"],
                pontos_melhoria: ["Pontos de melhoria não disponíveis"],
                estrategias_historico: ["Estratégias não disponíveis"]
            }
        };
    }
}