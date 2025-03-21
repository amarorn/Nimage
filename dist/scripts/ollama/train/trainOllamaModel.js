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
Object.defineProperty(exports, "__esModule", { value: true });
const OllamaService_1 = require("../../../application/services/OllamaService");
function trainOllamaModel() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('🚀 Iniciando treinamento do modelo...');
            const ollamaService = new OllamaService_1.OllamaService();
            // Exemplo de treinamento 1 - Vendedor com crescimento consistente
            const example1 = {
                prompt: `Analise o histórico de vendas do vendedor João Silva:

Métricas:
- FEA: 1.2
- IAP: 1800
- Dias Ativos: 90
- Total Vendido: 135000
- Média Diária: 1500
- % Meta Equipe: 135.00%
- Peso na Equipe: 135.00%
- Meta Individual: 135000
- Meta Diária: 4354.84
- Meta Equipe: 100000

Histórico de Vendas:
[
    {"mes": "Janeiro", "valor": 20000},
    {"mes": "Fevereiro", "valor": 22000},
    {"mes": "Março", "valor": 25000},
    {"mes": "Abril", "valor": 28000},
    {"mes": "Maio", "valor": 30000},
    {"mes": "Junho", "valor": 35000}
]

Responda APENAS com um JSON válido no formato abaixo. Não inclua texto adicional ou explicações:`,
                completion: `{
    "perfil_vendas": "Vendedor com crescimento consistente e forte performance",
    "tendencias": [
        "Crescimento médio de 12% ao mês",
        "Aumento na eficiência de vendas",
        "Melhoria na gestão de tempo"
    ],
    "pontos_fortes": [
        "Crescimento sustentável mês a mês",
        "Alta eficiência operacional (FEA 1.2)",
        "Superação consistente das metas"
    ],
    "pontos_fracos": [
        "Possível dependência de clientes específicos",
        "Necessidade de diversificação de produtos",
        "Risco de sobrecarga de trabalho"
    ],
    "recomendacoes": [
        "Desenvolver estratégias para novos clientes",
        "Implementar sistema de gestão de tempo",
        "Criar plano de diversificação de produtos"
    ],
    "projecao_crescimento": "Potencial de crescimento de 15% nos próximos 3 meses",
    "estrategias_personalizadas": [
        "Foco em clientes premium",
        "Desenvolvimento de novos canais de venda",
        "Implementação de CRM personalizado"
    ],
    "nova_meta_sugerida": 155250,
    "probabilidade_crescimento": "60% a 70%",
    "fator_ajuste_meta": 1.15,
    "dados_grafico": {
        "historico": [
            {"mes": "Janeiro", "valor": 20000},
            {"mes": "Fevereiro", "valor": 22000},
            {"mes": "Março", "valor": 25000},
            {"mes": "Abril", "valor": 28000},
            {"mes": "Maio", "valor": 30000},
            {"mes": "Junho", "valor": 35000}
        ],
        "previsao": [
            {"mes": "Julho", "valor": 38000},
            {"mes": "Agosto", "valor": 40000},
            {"mes": "Setembro", "valor": 42000}
        ]
    },
    "analise_historico": {
        "crescimento_periodo": "Crescimento consistente com média de 12% ao mês",
        "tendencias_identificadas": [
            "Aumento gradual no volume de vendas",
            "Melhoria na eficiência operacional",
            "Expansão da carteira de clientes"
        ],
        "pontos_melhoria": [
            "Diversificação da base de clientes",
            "Desenvolvimento de novos produtos",
            "Otimização do tempo de atendimento"
        ],
        "estrategias_historico": [
            "Foco em clientes premium",
            "Atendimento personalizado",
            "Desenvolvimento de novos canais"
        ]
    }
}`
            };
            // Exemplo de treinamento 2 - Vendedor com performance instável
            const example2 = {
                prompt: `Analise o histórico de vendas do vendedor Maria Santos:

Métricas:
- FEA: 0.8
- IAP: 1200
- Dias Ativos: 75
- Total Vendido: 90000
- Média Diária: 1200
- % Meta Equipe: 90.00%
- Peso na Equipe: 90.00%
- Meta Individual: 90000
- Meta Diária: 2903.23
- Meta Equipe: 100000

Histórico de Vendas:
[
    {"mes": "Janeiro", "valor": 15000},
    {"mes": "Fevereiro", "valor": 18000},
    {"mes": "Março", "valor": 22000},
    {"mes": "Abril", "valor": 15000},
    {"mes": "Maio", "valor": 20000}
]

Responda APENAS com um JSON válido no formato abaixo. Não inclua texto adicional ou explicações:`,
                completion: `{
    "perfil_vendas": "Vendedora com performance instável e potencial de crescimento",
    "tendencias": [
        "Variação significativa nas vendas mensais",
        "Crescimento médio de 8% ao mês",
        "Necessidade de estabilização"
    ],
    "pontos_fortes": [
        "Capacidade de recuperação após quedas",
        "Potencial de vendas em picos",
        "Boa relação com clientes"
    ],
    "pontos_fracos": [
        "Inconsistência nas vendas",
        "FEA abaixo do ideal (0.8)",
        "Dependência de períodos específicos"
    ],
    "recomendacoes": [
        "Implementar planejamento semanal",
        "Desenvolver estratégias de retenção",
        "Criar rotina de prospecção"
    ],
    "projecao_crescimento": "Potencial de crescimento de 25% nos próximos 3 meses",
    "estrategias_personalizadas": [
        "Sistema de acompanhamento diário",
        "Programa de mentoria",
        "Plano de desenvolvimento de habilidades"
    ],
    "nova_meta_sugerida": 99000,
    "probabilidade_crescimento": "40% a 50%",
    "fator_ajuste_meta": 0.95,
    "dados_grafico": {
        "historico": [
            {"mes": "Janeiro", "valor": 15000},
            {"mes": "Fevereiro", "valor": 18000},
            {"mes": "Março", "valor": 22000},
            {"mes": "Abril", "valor": 15000},
            {"mes": "Maio", "valor": 20000}
        ],
        "previsao": [
            {"mes": "Junho", "valor": 22000},
            {"mes": "Julho", "valor": 24000},
            {"mes": "Agosto", "valor": 26000}
        ]
    },
    "analise_historico": {
        "crescimento_periodo": "Crescimento instável com variações significativas",
        "tendencias_identificadas": [
            "Alternância entre picos e vales nas vendas",
            "Recuperação após períodos de baixa",
            "Potencial não totalmente explorado"
        ],
        "pontos_melhoria": [
            "Estabilização das vendas mensais",
            "Aumento da frequência de atividades",
            "Desenvolvimento de rotinas consistentes"
        ],
        "estrategias_historico": [
            "Implementação de planejamento semanal",
            "Desenvolvimento de estratégias de retenção",
            "Criação de rotinas de prospecção"
        ]
    }
}`
            };
            // Exemplo de treinamento 3 - Vendedor com performance estagnada
            const example3 = {
                prompt: `Analise o histórico de vendas do vendedor Pedro Oliveira:

Métricas:
- FEA: 0.9
- IAP: 1500
- Dias Ativos: 100
- Total Vendido: 150000
- Média Diária: 1500
- % Meta Equipe: 100.00%
- Peso na Equipe: 100.00%
- Meta Individual: 150000
- Meta Diária: 4838.71
- Meta Equipe: 100000

Histórico de Vendas:
[
    {"mes": "Janeiro", "valor": 25000},
    {"mes": "Fevereiro", "valor": 25000},
    {"mes": "Março", "valor": 25000},
    {"mes": "Abril", "valor": 25000},
    {"mes": "Maio", "valor": 25000},
    {"mes": "Junho", "valor": 25000}
]

Responda APENAS com um JSON válido no formato abaixo. Não inclua texto adicional ou explicações:`,
                completion: `{
    "perfil_vendas": "Vendedor com performance estável mas sem crescimento",
    "tendencias": [
        "Vendas consistentes sem variação",
        "Performance na média da equipe",
        "Necessidade de estímulo ao crescimento"
    ],
    "pontos_fortes": [
        "Consistência nas vendas",
        "Boa gestão de tempo",
        "Relacionamento estável com clientes"
    ],
    "pontos_fracos": [
        "Falta de crescimento",
        "Possível zona de conforto",
        "Necessidade de novos desafios"
    ],
    "recomendacoes": [
        "Estabelecer metas de crescimento",
        "Desenvolver novas estratégias",
        "Implementar sistema de recompensas"
    ],
    "projecao_crescimento": "Potencial de crescimento de 15% nos próximos 3 meses",
    "estrategias_personalizadas": [
        "Programa de desenvolvimento pessoal",
        "Sistema de metas progressivas",
        "Plano de expansão de clientes"
    ],
    "nova_meta_sugerida": 172500,
    "probabilidade_crescimento": "45% a 55%",
    "fator_ajuste_meta": 1.15,
    "dados_grafico": {
        "historico": [
            {"mes": "Janeiro", "valor": 25000},
            {"mes": "Fevereiro", "valor": 25000},
            {"mes": "Março", "valor": 25000},
            {"mes": "Abril", "valor": 25000},
            {"mes": "Maio", "valor": 25000},
            {"mes": "Junho", "valor": 25000}
        ],
        "previsao": [
            {"mes": "Julho", "valor": 27500},
            {"mes": "Agosto", "valor": 30000},
            {"mes": "Setembro", "valor": 32500}
        ]
    },
    "analise_historico": {
        "crescimento_periodo": "Performance estável sem crescimento",
        "tendencias_identificadas": [
            "Consistência nas vendas mensais",
            "Estabilidade na performance",
            "Necessidade de estímulo ao crescimento"
        ],
        "pontos_melhoria": [
            "Desenvolvimento de novas estratégias",
            "Expansão da carteira de clientes",
            "Implementação de metas progressivas"
        ],
        "estrategias_historico": [
            "Criação de programa de desenvolvimento",
            "Implementação de sistema de recompensas",
            "Desenvolvimento de novas abordagens"
        ]
    }
}`
            };
            // Treina o modelo com os exemplos
            console.log('\n📚 Treinando exemplo 1...');
            yield ollamaService.trainModel(example1);
            console.log('\n📚 Treinando exemplo 2...');
            yield ollamaService.trainModel(example2);
            console.log('\n📚 Treinando exemplo 3...');
            yield ollamaService.trainModel(example3);
            console.log('\n✅ Treinamento concluído com sucesso!');
        }
        catch (error) {
            console.error('❌ Erro durante o treinamento:', error);
        }
    });
}
trainOllamaModel().catch(console.error);
//# sourceMappingURL=trainOllamaModel.js.map