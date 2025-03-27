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
        try {
            if (!vendorInfo || !vendorInfo.resultado) {
                throw new Error('Invalid vendorInfo structure');
            }
            const vendedor = vendorInfo.resultado.vendedor;
            const equipe = vendorInfo.resultado.equipe;
            // Log dos dados iniciais para debug
            console.log('🔍 Dados recebidos:', vendorInfo);
            console.log('👤 Dados do vendedor:', {
                nome: vendedor.nome,
                vendasMesAnterior: vendedor.vendasMesAnterior,
                totalVendasEquipeMesAnterior: vendedor.totalVendasEquipeMesAnterior,
                metaEquipe: equipe.meta,
                metaAnterior: equipe.meta_anterior
            });
            // Calcula o percentual de contribuição para a meta da equipe usando dados do mês anterior
            const vendasMesAnterior = parseFloat(vendedor.vendasMesAnterior) || 0;
            const totalVendasEquipeMesAnterior = parseFloat(vendedor.totalVendasEquipeMesAnterior) || 1;
            // Verifica se totalVendasEquipeMesAnterior é zero para evitar divisão por zero
            let percentualContribuicao = 0;
            if (totalVendasEquipeMesAnterior > 0) {
                percentualContribuicao = vendasMesAnterior / totalVendasEquipeMesAnterior;
            }
            // Se o vendedor não tem histórico, usa uma distribuição igualitária
            const temHistorico = vendedor.numeroDiasComAtividade > 0;
            const percentualContribuicao_Final = temHistorico && percentualContribuicao > 0 ? percentualContribuicao : 1 / (vendedor.totalVendedores || 1);
            // Formata os valores monetários e percentuais
            const percentualContribuicaoFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'percent',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(percentualContribuicao_Final);
            // Obtém os valores dos últimos 3 meses
            const vm1 = vendedor.vendasMesAnterior; // segundo mês anterior ao filtro
            const vm2 = vendedor.totalVendasMesAnterior; // primeiro mês anterior ao filtro
            const vm3 = vendedor.somaDocinhos; // mês atual (filtro)
            // Calcula os crescimentos percentuais
            const c1 = vm1 > 0 ? ((vm2 - vm1) / vm1) * 100 : 0;
            const c2 = vm2 > 0 ? ((vm3 - vm2) / vm2) * 100 : 0;
            // Calcula a média dos crescimentos
            const crescimentoMedio = (c1 + c2) / 2;
            // Calcula a nova meta sugerida
            const metaSugerida = vm3 * (1 + (crescimentoMedio / 100));
            console.log('📈 Análise de Crescimento:', {
                vm1: vm1.toFixed(2),
                vm2: vm2.toFixed(2),
                vm3: vm3.toFixed(2),
                c1: c1.toFixed(2) + '%',
                c2: c2.toFixed(2) + '%',
                crescimentoMedio: crescimentoMedio.toFixed(2) + '%',
                metaSugerida: metaSugerida.toFixed(2)
            });
            // Prepara o histórico de vendas
            const historico = vendedor.historicoVendas || [];
            console.log('📊 Histórico de vendas:', historico);
            // Retorna apenas os campos solicitados
            return {
                tendencia: "Estabilização com viés de recuperação nos últimos dias",
                observacoes: [
                    "Após queda acentuada no início do mês, houve retomada gradual na reta final.",
                    "Volume de vendas mais consistente nas semanas finais, indicando possível reação."
                ],
                recomendacoes: [
                    "Manter o ritmo dos últimos dias e reforçar atuação em dias úteis.",
                    "Avaliar quais ações geraram aumento no final do mês e replicar."
                ]
            };
        }
        catch (error) {
            console.error('❌ Error in getInsights:', error);
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