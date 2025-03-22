"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class OllamaService {
    constructor() {
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434/api';
    }
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async fetchWithRetry(url, options, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await (0, node_fetch_1.default)(url, options);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            }
            catch (error) {
                if (i === maxRetries - 1)
                    throw error;
                console.log(`Tentativa ${i + 1} falhou, tentando novamente em 2 segundos...`);
                await this.delay(2000);
            }
        }
    }
    async getInsights(vendorInfo) {
        var _a;
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
            // Atualiza o objeto vendedor original com os valores calculados
            vendedor.percentualContribuicao = percentualContribuicaoFormatado.replace('%', '').replace(',', '.') + '%';
            vendedor.percentualCrescimento = percentualCrescimento.toFixed(2);
            // Prepara dados para análise
            const analysisPrompt = `Você é um assistente especializado em análise de dados de vendas.

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
                historico: vendedor.historicoVendas || [],
                percentualCrescimento: vendedor.percentualCrescimento
            }, null, 2)}

RETORNE EXATAMENTE ESTE JSON PREENCHIDO (MANTENHA A ESTRUTURA EXATA):

{
  "perfilVendas": "Vendedor experiente com alto FEA",
  "tendencias": ["Crescimento constante nas vendas", "Aumento na média diária"],
  "pontosFracos": ["Baixa conversão", "Poucos clientes novos"],
  "pontosFortes": ["Alta eficiência", "Bom relacionamento"],
  "recomendacoes": ["Aumentar base de clientes", "Focar em produtos premium"],
  "projecaoCrescimento": "Crescimento de 15% esperado",
  "probabilidadeCrescimento": "75%",
  "fatorAjusteMeta": 0.8,
  "novaMeta": 65000,
  "estrategiasPersonalizadas": ["Visitar clientes VIP", "Oferecer pacotes especiais"],
  "historico": [
    {"mes": "Janeiro", "valor": 37500},
    {"mes": "Fevereiro", "valor": 37500},
    {"mes": "Março", "valor": 37500},
    {"mes": "Abril", "valor": 37500}
  ],
  "previsao": [
    {"mes": "Maio", "valor": 43125},
    {"mes": "Junho", "valor": 49594}
  ],
  "analise_historico": {
    "crescimento_periodo": "Crescimento constante no período analisado",
    "tendencias_identificadas": ["Aumento gradual nas vendas", "Melhoria na performance"],
    "pontos_melhoria": ["Aumentar volume de vendas", "Melhorar conversão"],
    "estrategias_historico": ["Foco em produtos principais", "Atendimento personalizado"]
  }
}

- Use os dados de histórico de vendas para detectar padrões de crescimento
- Identifique tendências de vendas (ex: aumento de ticket médio, vendas em dias específicos)
- Aponte pontos de melhoria com base em atividades e metas
- Sugira estratégias com base nos padrões do histórico
- NÃO escreva nada além do JSON de saída

IMPORTANTE:
1. Use os dados de histórico de vendas para detectar padrões de crescimento
2. Identifique tendências de vendas (ex: aumento de ticket médio, vendas em dias específicos)
3. Aponte pontos de melhoria com base em atividades e metas
4. Sugira estratégias com base nos padrões do histórico
5. MANTENHA EXATAMENTE A MESMA ESTRUTURA DO JSON ACIMA
6. APENAS ALTERE OS VALORES, NÃO MUDE OS CAMPOS
7. NÃO ADICIONE CAMPOS NOVOS
8. NÃO REMOVA CAMPOS EXISTENTES
9. NÃO INCLUA NENHUM TEXTO ANTES OU DEPOIS DO JSON
10. O CAMPO "tendencias" DEVE SER UM ARRAY COM PELO MENOS UM ITEM
11. TODOS OS ARRAYS DEVEM TER PELO MENOS UM ITEM`;
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/chat`, {
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
            let analysis;
            try {
                console.log('\n🤖 Resposta bruta do Ollama:', result);
                if (!((_a = result.message) === null || _a === void 0 ? void 0 : _a.content)) {
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
                }
                catch (parseError) {
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
                    }
                    catch (normalizeError) {
                        console.error('\n❌ Erro ao fazer parse do JSON normalizado:', normalizeError);
                        throw new Error('JSON inválido após normalização');
                    }
                }
                // Calcular percentual de contribuição
                const totalVendasEquipe = Number(vendedor.totalVendasEquipeMesAnterior);
                const vendasVendedor = Number(vendedor.vendasMesAnterior);
                const percentualContribuicao = (vendasVendedor / totalVendasEquipe) * 100;
                // Calcular percentual de crescimento
                const percentualCrescimento = Number(vendedor.percentualCrescimento);
                // Calcular peso na equipe
                const totalVendedores = Number(vendedor.totalVendedores);
                const pesoNaEquipe = (1 / totalVendedores) * 100;
                // Calcular distribuição da meta
                const metaEquipe = Number(vendorInfo.resultado.equipe.meta);
                const distribuicaoMeta = metaEquipe / totalVendedores;
                // Calcular desempenho diário ideal
                const diasUteis = 22; // Média de dias úteis por mês
                const desempenhoDiarioIdeal = distribuicaoMeta / diasUteis;
                const vendedorReorganizado = {
                    nome: vendedor.nome,
                    feaVendedor: vendedor.feaVendedor,
                    iapVendedor: vendedor.iapVendedor,
                    numeroDiasComAtividade: vendedor.numeroDiasComAtividade,
                    somaDocinhos: vendedor.somaDocinhos,
                    mediaAtividadePorDia: vendedor.mediaAtividadePorDia,
                    percentualContribuicao: percentualContribuicao.toFixed(2),
                    percentualCrescimento: percentualCrescimento.toFixed(2),
                    pesoNaEquipe: pesoNaEquipe.toFixed(2),
                    distribuicaoMeta: distribuicaoMeta.toFixed(2),
                    desempenhoDiarioIdeal: desempenhoDiarioIdeal.toFixed(2),
                    dadosGrafico: {
                        historico: vendedor.historicoVendas,
                        previsao: analysis.previsao
                    },
                    analiseHistorico: {
                        crescimentoPeriodo: analysis.analise_historico.crescimento_periodo,
                        tendenciasIdentificadas: analysis.analise_historico.tendencias_identificadas,
                        pontosMelhoria: analysis.analise_historico.pontos_melhoria,
                        estrategiasHistorico: analysis.analise_historico.estrategias_historico
                    }
                };
                console.log('\n✅ Resultado da análise:');
                console.log('=========================\n');
                console.log('👤 Informações do Vendedor:');
                console.log('---------------------------');
                console.log(`Nome: ${vendedor.nome}`);
                console.log(`FEA: ${vendedor.feaVendedor}`);
                console.log(`IAP: ${vendedor.iapVendedor}`);
                console.log(`Dias com Atividade: ${vendedor.numeroDiasComAtividade}`);
                console.log(`Total de Docinhos: ${vendedor.somaDocinhos.toLocaleString()}`);
                console.log(`Média por Dia: ${vendedor.mediaAtividadePorDia.toLocaleString()}\n`);
                console.log('📈 Métricas de Performance:');
                console.log('---------------------------');
                console.log(`Percentual de Contribuição: ${vendedorReorganizado.percentualContribuicao}%`);
                console.log(`Percentual de Crescimento: ${vendedorReorganizado.percentualCrescimento}%`);
                console.log(`Peso na Equipe: ${vendedorReorganizado.pesoNaEquipe}%`);
                console.log(`Distribuição da Meta: ${vendedorReorganizado.distribuicaoMeta}`);
                console.log(`Desempenho Diário Ideal: ${vendedorReorganizado.desempenhoDiarioIdeal}\n`);
                return {
                    resultado: {
                        vendedor: vendedorReorganizado
                    }
                };
            }
            catch (error) {
                console.error('\n❌ Erro ao processar resposta do Ollama:', error);
                throw error;
            }
        }
        catch (error) {
            console.error('\n❌ Erro ao gerar insights:', error);
            throw error;
        }
    }
    determinePositioning(vendedor) {
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
    async trainModel({ prompt, completion }) {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/chat`, {
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
        }
        catch (error) {
            console.error('Erro ao treinar modelo:', error);
            throw new Error(`Erro ao treinar modelo: ${error.message}`);
        }
    }
    validateAnalysisStructure(analysis) {
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
    getDefaultAnalysis(metaEquipe) {
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
                { "mes": "Janeiro", "valor": 0 },
                { "mes": "Fevereiro", "valor": 0 },
                { "mes": "Março", "valor": 0 },
                { "mes": "Abril", "valor": 0 }
            ],
            previsao: [
                { "mes": "Maio", "valor": 0 },
                { "mes": "Junho", "valor": 0 }
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
exports.OllamaService = OllamaService;
//# sourceMappingURL=OllamaService.js.map