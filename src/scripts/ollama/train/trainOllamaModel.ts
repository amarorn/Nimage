import { OllamaService } from '@/application/services/OllamaService';

async function trainOllamaModel() {
    try {
        console.log('🚀 Iniciando treinamento do modelo...');
        
        const ollamaService = new OllamaService();
        
        // Exemplo de treinamento 1
        const example1 = {
            prompt: `Você é um assistente especializado em análise de vendedores. Analise o desempenho do vendedor João com base nos seguintes dados:

Métricas:
- FEA: 1.5 (Eficiência das atividades)
- IAP: 2250 (Potencial de vendas)
- Dias Ativos: 120
- Total Vendido: 150000
- Média Diária: 1250
- % Meta Equipe: 150.00%
- Peso na Equipe: 150.00%
- Meta Individual: 150000
- Meta Diária: 4838.71
- Meta Equipe: 100000

Histórico de Vendas:
[
    {"mes": "Janeiro", "valor": 37500},
    {"mes": "Fevereiro", "valor": 37500},
    {"mes": "Março", "valor": 37500},
    {"mes": "Abril", "valor": 37500},
    {"mes": "Maio", "valor": 37500},
    {"mes": "Junho", "valor": 37500}
]

Responda APENAS com um JSON válido no formato abaixo. Não inclua texto adicional ou explicações:`,
            completion: `{
    "perfil_vendas": "Vendedor experiente com alto desempenho e consistência nas vendas",
    "tendencias": [
        "Vendas estáveis ao longo dos meses",
        "Alta eficiência operacional",
        "Superação consistente das metas"
    ],
    "pontos_fortes": [
        "Excelente FEA (1.5) indicando alta eficiência",
        "Consistência nas vendas mensais",
        "Contribuição significativa para a meta da equipe"
    ],
    "pontos_fracos": [
        "Possível estagnação no crescimento",
        "Dependência da equipe em um único vendedor",
        "Risco de sobrecarga"
    ],
    "recomendacoes": [
        "Desenvolver plano de mentoria para outros vendedores",
        "Estabelecer metas de crescimento progressivo",
        "Implementar sistema de reconhecimento e recompensas"
    ],
    "projecao_crescimento": "Potencial de crescimento de 10% nos próximos 3 meses",
    "estrategias_personalizadas": [
        "Criar programa de desenvolvimento de liderança",
        "Estabelecer metas desafiadoras mas alcançáveis",
        "Implementar sistema de feedback regular"
    ],
    "nova_meta_sugerida": 165000,
    "probabilidade_crescimento": "30% a 40%",
    "fator_ajuste_meta": 1.2,
    "dados_grafico": {
        "historico": [
            {"mes": "Janeiro", "valor": 37500},
            {"mes": "Fevereiro", "valor": 37500},
            {"mes": "Março", "valor": 37500},
            {"mes": "Abril", "valor": 37500},
            {"mes": "Maio", "valor": 37500},
            {"mes": "Junho", "valor": 37500}
        ],
        "previsao": [
            {"mes": "Julho", "valor": 41250},
            {"mes": "Agosto", "valor": 42500},
            {"mes": "Setembro", "valor": 43750}
        ]
    },
    "analise_historico": {
        "crescimento_periodo": "Estável com média de 37500 por mês",
        "tendencias_identificadas": [
            "Consistência nas vendas mensais",
            "Alta performance sustentada",
            "Superação constante das metas"
        ],
        "pontos_melhoria": [
            "Diversificação de estratégias de venda",
            "Desenvolvimento de novas habilidades",
            "Equilíbrio entre performance e sustentabilidade"
        ],
        "estrategias_historico": [
            "Manter a consistência nas vendas",
            "Compartilhar boas práticas com a equipe",
            "Desenvolver plano de sucessão"
        ]
    }
}`
        };

        // Exemplo de treinamento 2
        const example2 = {
            prompt: `Você é um assistente especializado em análise de vendedores. Analise o desempenho do vendedor Maria com base nos seguintes dados:

Métricas:
- FEA: 0.8 (Eficiência das atividades)
- IAP: 1500 (Potencial de vendas)
- Dias Ativos: 90
- Total Vendido: 75000
- Média Diária: 833
- % Meta Equipe: 75.00%
- Peso na Equipe: 75.00%
- Meta Individual: 75000
- Meta Diária: 2500
- Meta Equipe: 100000

Histórico de Vendas:
[
    {"mes": "Janeiro", "valor": 10000},
    {"mes": "Fevereiro", "valor": 12000},
    {"mes": "Março", "valor": 15000},
    {"mes": "Abril", "valor": 18000},
    {"mes": "Maio", "valor": 20000}
]

Responda APENAS com um JSON válido no formato abaixo. Não inclua texto adicional ou explicações:`,
            completion: `{
    "perfil_vendas": "Vendedora em desenvolvimento com potencial de crescimento",
    "tendencias": [
        "Crescimento constante nas vendas",
        "Evolução gradual do desempenho",
        "Adaptação progressiva às metas"
    ],
    "pontos_fortes": [
        "Crescimento consistente mês a mês",
        "Boa evolução no volume de vendas",
        "Potencial de desenvolvimento"
    ],
    "pontos_fracos": [
        "FEA abaixo do ideal (0.8)",
        "Eficiência operacional a melhorar",
        "Meta individual ainda não alcançada"
    ],
    "recomendacoes": [
        "Investir em treinamento e capacitação",
        "Acompanhamento próximo da liderança",
        "Estabelecer metas intermediárias"
    ],
    "projecao_crescimento": "Potencial de crescimento de 20% nos próximos 3 meses",
    "estrategias_personalizadas": [
        "Programa de mentoria personalizado",
        "Foco em desenvolvimento de habilidades",
        "Acompanhamento semanal de resultados"
    ],
    "nova_meta_sugerida": 85000,
    "probabilidade_crescimento": "40% a 50%",
    "fator_ajuste_meta": 0.9,
    "dados_grafico": {
        "historico": [
            {"mes": "Janeiro", "valor": 10000},
            {"mes": "Fevereiro", "valor": 12000},
            {"mes": "Março", "valor": 15000},
            {"mes": "Abril", "valor": 18000},
            {"mes": "Maio", "valor": 20000}
        ],
        "previsao": [
            {"mes": "Junho", "valor": 22000},
            {"mes": "Julho", "valor": 24000},
            {"mes": "Agosto", "valor": 26000}
        ]
    },
    "analise_historico": {
        "crescimento_periodo": "Crescimento médio de 25% ao mês",
        "tendencias_identificadas": [
            "Evolução constante no desempenho",
            "Adaptação progressiva ao papel",
            "Melhoria na curva de aprendizado"
        ],
        "pontos_melhoria": [
            "Eficiência nas atividades diárias",
            "Volume de vendas por dia",
            "Consistência na performance"
        ],
        "estrategias_historico": [
            "Manter ritmo de crescimento",
            "Focar em eficiência operacional",
            "Desenvolver habilidades específicas"
        ]
    }
}`
        };

        // Treina o modelo com os exemplos
        console.log('\n📚 Treinando exemplo 1...');
        await ollamaService.trainModel(example1);
        
        console.log('\n📚 Treinando exemplo 2...');
        await ollamaService.trainModel(example2);
        
        console.log('\n✅ Treinamento concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante o treinamento:', error);
    }
}

trainOllamaModel().catch(console.error);