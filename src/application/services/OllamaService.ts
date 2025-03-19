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

            // Log detalhado do mês anterior
            console.log('\n📊 Dados do Mês Anterior:');
            console.log('------------------------');
            console.log(`🎯 Meta da Equipe: ${vendorInfo.resultado.equipe.meta_anterior}`);
            console.log(`🍪 Total de Docinhos do Vendedor: ${vendedor.vendasMesAnterior}`);
            console.log(`📈 Total de Vendas da Equipe: ${vendedor.totalVendasEquipeMesAnterior}`);
            console.log(`📅 Período: ${vendorInfo.resultado.equipe.periodoMetaAnterior || 'Não especificado'}`);
            console.log('------------------------\n');

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
            const analysisPrompt = `RETORNE APENAS O JSON ABAIXO PREENCHIDO COM SUA ANÁLISE.
NÃO INCLUA NENHUM TEXTO ANTES OU DEPOIS.
NÃO INCLUA EXPLICAÇÕES.
NÃO INCLUA NOTAS.
APENAS O JSON.

DADOS DO VENDEDOR:
${JSON.stringify({
    nome: vendedor.nome,
    fea: vendedor.feaVendedor,
    iap: vendedor.iapVendedor,
    dias_ativos: vendedor.numeroDiasComAtividade,
    total_vendas: vendedor.somaDocinhos,
    media_diaria: vendedor.mediaAtividadePorDia,
    meta_individual: metaIndividual.toFixed(2),
    meta_equipe: metaEquipe,
    contribuicao: percentualContribuicaoFormatado,
    historico: vendedor.historicoVendas || []
}, null, 2)}

COPIE E PREENCHA ESTE JSON:

{
    "perfil_vendas": "Vendedor experiente com bom desempenho",
    "tendencias": [
        "Crescimento constante nas vendas",
        "Melhoria no FEA"
    ],
    "pontos_fortes": [
        "Alta eficiência nas atividades",
        "Bom relacionamento com clientes"
    ],
    "pontos_fracos": [
        "Dificuldade com novos produtos",
        "Baixa prospecção"
    ],
    "recomendacoes": [
        "Focar em treinamentos",
        "Aumentar base de clientes"
    ],
    "projecao_crescimento": "Crescimento esperado de 15% nos próximos 3 meses",
    "estrategias_personalizadas": [
        "Participar de workshops",
        "Desenvolver networking"
    ],
    "nova_meta_sugerida": ${metaEquipe},
    "probabilidade_crescimento": "70% de chance de atingir a meta",
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
        "crescimento_periodo": "Crescimento constante no período analisado",
        "tendencias_identificadas": [
            "Aumento gradual nas vendas",
            "Melhoria na performance"
        ],
        "pontos_melhoria": [
            "Aumentar volume de vendas",
            "Melhorar conversão"
        ],
        "estrategias_historico": [
            "Foco em produtos principais",
            "Atendimento personalizado"
        ]
    }
}`;

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
                            content: analysisPrompt
                        }
                    ],
                    stream: false,
                    options: {
                        num_ctx: 4096,
                        temperature: 0.7,
                        top_k: 40,
                        top_p: 0.9
                    }
                }),
            });

            if (!response.ok) {
                console.error(`❌ Erro na chamada do Ollama: ${response.status} - ${response.statusText}`);
                throw new Error(`Erro na chamada do Ollama: ${response.status}`);
            }

            const result = await response.json();
            
            // Processa a resposta do Ollama
            let analysis: AnaliseVendedor;
            try {
                console.log('\n🤖 Resposta bruta do Ollama:', result);
                
                if (!result.message?.content) {
                    console.error('❌ Resposta do Ollama está vazia');
                    throw new Error('Resposta do Ollama está vazia');
                }

                // Remove caracteres especiais e espaços extras
                const cleanResponse = result.message.content
                    .replace(/\\n/g, ' ')
                    .replace(/\\"/g, '"')
                    .replace(/\\\\/g, '\\')
                    .replace(/\n/g, ' ')
                    .replace(/\r/g, ' ')
                    .replace(/\t/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                
                console.log('\n🧹 Resposta limpa:', cleanResponse);

                // Tenta encontrar um JSON válido na resposta
                const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    console.error('❌ Nenhum JSON válido encontrado na resposta');
                    throw new Error('Resposta não contém JSON válido');
                }

                console.log('\n📝 JSON encontrado:', jsonMatch[0]);
                
                // Normaliza as chaves do JSON
                let jsonStr = jsonMatch[0];
                try {
                    // Tenta fazer o parse direto primeiro
                    analysis = JSON.parse(jsonStr);
                    console.log('\n✅ JSON parseado com sucesso!');
                } catch (parseError) {
                    console.log('\n⚠️ Erro no parse direto, tentando normalizar o JSON...');
                    
                    // Se falhar, tenta normalizar o JSON
                    jsonStr = jsonStr
                        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
                        .replace(/:\s*'([^']*)'/g, ':"$1"')
                        .replace(/,(\s*[}\]])/g, '$1');
                    
                    console.log('\n🔄 JSON normalizado:', jsonStr);
                    
                    try {
                        analysis = JSON.parse(jsonStr);
                        console.log('\n✅ JSON parseado com sucesso após normalização!');
                    } catch (normalizeError) {
                        console.error('\n❌ Erro ao fazer parse do JSON normalizado:', normalizeError);
                        throw new Error('JSON inválido após normalização');
                    }
                }

                // Valida a estrutura do JSON
                if (!this.validateAnalysisStructure(analysis)) {
                    console.error('\n❌ Estrutura do JSON inválida');
                    throw new Error('Estrutura do JSON inválida');
                }

            } catch (error) {
                console.error('\n❌ Erro ao processar resposta do Ollama:', error);
                analysis = this.getDefaultAnalysis(metaEquipeNumerico);
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

    private validateAnalysisStructure(analysis: any): boolean {
        const requiredFields = [
            'perfil_vendas',
            'tendencias',
            'pontos_fortes',
            'pontos_fracos',
            'recomendacoes',
            'projecao_crescimento',
            'estrategias_personalizadas',
            'nova_meta_sugerida',
            'probabilidade_crescimento',
            'fator_ajuste_meta',
            'dados_grafico'
        ];

        // Verifica campos obrigatórios
        for (const field of requiredFields) {
            if (!analysis[field]) {
                console.error(`❌ Campo obrigatório ausente: ${field}`);
                return false;
            }
        }

        // Verifica arrays
        const arrayFields = ['tendencias', 'pontos_fortes', 'pontos_fracos', 'recomendacoes', 'estrategias_personalizadas'];
        for (const field of arrayFields) {
            if (!Array.isArray(analysis[field]) || analysis[field].length === 0) {
                console.error(`❌ Campo ${field} deve ser um array não vazio`);
                return false;
            }
        }

        // Verifica dados do gráfico
        if (!analysis.dados_grafico.historico || !Array.isArray(analysis.dados_grafico.historico)) {
            console.error('❌ dados_grafico.historico deve ser um array');
            return false;
        }

        if (!analysis.dados_grafico.previsao || !Array.isArray(analysis.dados_grafico.previsao)) {
            console.error('❌ dados_grafico.previsao deve ser um array');
            return false;
        }

        return true;
    }

    private getDefaultAnalysis(metaEquipe: number): AnaliseVendedor {
        return {
            perfil_vendas: "Perfil não disponível",
            tendencias: ["Tendências não disponíveis"],
            pontos_fortes: ["Pontos fortes não disponíveis"],
            pontos_fracos: ["Pontos fracos não disponíveis"],
            recomendacoes: ["Recomendações não disponíveis"],
            projecao_crescimento: "Projeção não disponível",
            probabilidade_crescimento: "10% a 20%",
            fator_ajuste_meta: "0.0000",
            estrategias_personalizadas: ["Estratégias não disponíveis"],
            nova_meta_sugerida: metaEquipe,
            dados_grafico: {
                historico: [],
                previsao: []
            },
            analise_historico: {
                crescimento_periodo: "Análise não disponível",
                tendencias_identificadas: ["Tendências não identificadas"],
                pontos_melhoria: ["Pontos de melhoria não disponíveis"],
                estrategias_historico: ["Estratégias não disponíveis"]
            }
        };
    }
}