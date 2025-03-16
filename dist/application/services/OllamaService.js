"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    getInsights(vendorInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!vendorInfo || !vendorInfo.resultado) {
                    throw new Error('Invalid vendorInfo structure');
                }
                const vendedor = vendorInfo.resultado.vendedor;
                const analysisPrompt = `
Analise o desempenho histórico do vendedor ${vendedor.nome} com base nos seguintes dados:

Métricas Atuais:
- FEA (Fator de Eficiência de Atividade): ${vendedor.feaVendedor}
- IAP (Indicador de Atividade Potencial): ${vendedor.iapVendedor}
- Dias com Atividade: ${vendedor.numeroDiasComAtividade}
- Total de Docinhos Vendidos: ${vendedor.somaDocinhos}
- Média por Dia: ${vendedor.mediaAtividadePorDia}

Meta da Equipe:
- Objetivo: ${vendorInfo.resultado.equipe.meta}

Por favor, forneça uma análise detalhada incluindo:
1. Análise do perfil de vendas
2. Tendências identificadas
3. Pontos fortes e fracos
4. Recomendações específicas
5. Projeção de crescimento
6. Estratégias personalizadas de melhoria
7. Sugestão de nova meta individual
8. Probabilidade de crescimento
9. Fator de ajuste de meta recomendado
10. Dados para gráfico de tendência (últimos 6 meses)
11. Previsão de vendas para os próximos 3 meses

Responda APENAS com o JSON abaixo, sem texto adicional:
{
  "perfil_vendas": "descrição detalhada do perfil do vendedor",
  "tendencias": ["tendência 1", "tendência 2"],
  "pontos_fortes": ["ponto forte 1", "ponto forte 2"],
  "pontos_fracos": ["ponto fraco 1", "ponto fraco 2"],
  "recomendacoes": ["recomendação 1", "recomendação 2"],
  "projecao_crescimento": "descrição da projeção de crescimento",
  "estrategias_personalizadas": ["estratégia 1", "estratégia 2"],
  "nova_meta_sugerida": "valor numérico da nova meta sugerida",
  "probabilidade_crescimento": "faixa de probabilidade de crescimento (ex: 20% a 30%)",
  "fator_ajuste_meta": "valor numérico do fator de ajuste sugerido (ex: 0.4455)",
  "dados_grafico": {
    "historico": [
      {"mes": "Janeiro", "valor": 0},
      {"mes": "Fevereiro", "valor": 0},
      {"mes": "Março", "valor": 0},
      {"mes": "Abril", "valor": 0},
      {"mes": "Maio", "valor": 0},
      {"mes": "Junho", "valor": 0}
    ],
    "previsao": [
      {"mes": "Julho", "valor": 0},
      {"mes": "Agosto", "valor": 0},
      {"mes": "Setembro", "valor": 0}
    ]
  }
}`;
                const response = yield (0, node_fetch_1.default)(`${this.baseUrl}/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'nimage',
                        prompt: analysisPrompt,
                        stream: false,
                    }),
                });
                const result = yield response.json();
                // Processa a resposta do Ollama
                try {
                    const analysis = JSON.parse(result.response);
                    vendedor.perfil_vendas = analysis.perfil_vendas;
                    vendedor.tendencias = analysis.tendencias;
                    vendedor.pontos_fortes = analysis.pontos_fortes;
                    vendedor.pontos_fracos = analysis.pontos_fracos;
                    vendedor.recomendacoes = analysis.recomendacoes;
                    vendedor.projecao_crescimento = analysis.projecao_crescimento;
                    vendedor.estrategias_personalizadas = analysis.estrategias_personalizadas;
                    vendedor.nova_meta_sugerida = parseFloat(analysis.nova_meta_sugerida);
                    vendedor.probabilidade_crescimento = analysis.probabilidade_crescimento;
                    vendedor.fator_ajuste_meta = parseFloat(analysis.fator_ajuste_meta);
                    vendedor.dados_grafico = analysis.dados_grafico;
                }
                catch (error) {
                    console.error('Erro ao processar resposta do Ollama:', error);
                    // Define valores padrão em caso de erro
                    vendedor.perfil_vendas = "Perfil não disponível";
                    vendedor.tendencias = ["Tendências não disponíveis"];
                    vendedor.pontos_fortes = ["Pontos fortes não disponíveis"];
                    vendedor.pontos_fracos = ["Pontos fracos não disponíveis"];
                    vendedor.recomendacoes = ["Recomendações não disponíveis"];
                    vendedor.projecao_crescimento = "Projeção não disponível";
                    vendedor.estrategias_personalizadas = ["Estratégias não disponíveis"];
                    vendedor.nova_meta_sugerida = vendorInfo.resultado.equipe.meta;
                    vendedor.probabilidade_crescimento = "20% a 30%";
                    vendedor.fator_ajuste_meta = 0.1;
                    vendedor.dados_grafico = {
                        historico: Array(6).fill({ mes: "", valor: 0 }),
                        previsao: Array(3).fill({ mes: "", valor: 0 })
                    };
                }
                return vendorInfo;
            }
            catch (error) {
                console.error('Error fetching insights from Ollama:', error);
                throw error;
            }
        });
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
}
exports.OllamaService = OllamaService;
