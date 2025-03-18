import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

interface TrainingExample {
    prompt: string;
    completion: string;
}

interface VendedorStats {
    mediaGeral: number;
    mediaPonderada: number;
    mediaDiaSemana: number[];
    mediaMes: number[];
    metaRatio: number;
    sazonalidade: number;
}

interface Metadata {
    equipe: { [key: string]: number };
    vendedor: { [key: string]: number };
    maxMeta: number;
    minMeta: number;
    maxDocinhos: number;
    minDocinhos: number;
    meanDocinhos: number;
    stdDocinhos: number;
    meanMeta: number;
    stdMeta: number;
    vendedorStats: { [key: string]: VendedorStats };
}

export class LocalOllamaTrainer {
    private baseUrl: string;
    private metadata: Metadata;

    constructor() {
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434/api';
        this.metadata = this.loadMetadata();
    }

    private loadMetadata(): Metadata {
        const metadataPath = path.join(process.cwd(), 'models', 'nimage_model_metadata.json');
        const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
        return JSON.parse(metadataContent);
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

    private generateTrainingExamples(): TrainingExample[] {
        const examples: TrainingExample[] = [];
        const vendedores = Object.keys(this.metadata.vendedorStats);

        for (const vendedor of vendedores) {
            const stats = this.metadata.vendedorStats[vendedor];
            const equipeId = Object.entries(this.metadata.vendedor)
                .find(([nome]) => nome === vendedor)?.[1] || 0;
            const equipe = Object.entries(this.metadata.equipe)
                .find(([_, id]) => id === equipeId)?.[0] || '';

            // Gerar exemplos para cada dia da semana
            for (let dia = 0; dia < 7; dia++) {
                const prompt = `
Data: 2024-03-17
Dia da semana: ${dia}
Mês: 3
Vendedor: ${vendedor}
Equipe: ${equipe}
Meta da equipe: ${this.metadata.meanMeta}
É fim de semana? ${dia === 0 || dia === 6 ? 'Sim' : 'Não'}

Métricas:
- FEA atual: ${Math.round(stats.sazonalidade * 100)}
- IAP atual: ${stats.metaRatio.toFixed(2)}
- Média diária: ${Math.round(stats.mediaGeral)}
- Dias com atividade: 20

Baseado nessas informações, quantos docinhos serão vendidos?`;

                const previsao = Math.round(stats.mediaDiaSemana[dia] * (1 + stats.sazonalidade * 0.1));
                const completion = `Com base nos dados fornecidos, a previsão de vendas é de ${previsao} docinhos.`;

                examples.push({ prompt, completion });
            }
        }

        return examples;
    }

    private async createModelInOllama(modelName: string, examples: TrainingExample[]): Promise<void> {
        try {
            // Dividir exemplos em treino e validação
            const trainSize = Math.floor(examples.length * 0.8);
            const trainExamples = examples.slice(0, trainSize);
            const validationSet = examples.slice(trainSize);

            console.log('🔄 Criando modelo base...');
            await this.fetchWithRetry(`${this.baseUrl}/create`, {
                method: 'POST',
                body: JSON.stringify({
                    name: modelName,
                    modelfile: `FROM llama2
SYSTEM """Você é um assistente especializado em prever vendas de docinhos. 
Use os dados fornecidos para fazer previsões precisas baseadas em padrões históricos.
Considere fatores como:
- Dia da semana e sazonalidade
- Histórico do vendedor
- Desempenho da equipe
- Metas e objetivos
- FEA (Frequência de Atividades)
- IAP (Índice de Atividade Potencial)
- Tendências sazonais
- Padrões de vendas por região
- Impacto de eventos especiais

Responda apenas com números, sem explicações adicionais.
Use o formato: PREVISAO: [número]"""
PARAMETER temperature 0.7
PARAMETER top_k 40
PARAMETER top_p 0.9
PARAMETER num_ctx 4096
PARAMETER num_thread 4
PARAMETER repeat_last_n 64`
                }),
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('✅ Modelo base criado!');

            console.log('📚 Iniciando treinamento com exemplos...');
            let totalError = 0;
            let totalExamples = 0;

            for (let i = 0; i < trainExamples.length; i++) {
                const example = trainExamples[i];
                const trainingData = {
                    name: modelName,
                    prompt: example.prompt,
                    response: example.completion
                };

                await this.fetchWithRetry(`${this.baseUrl}/tune`, {
                    method: 'POST',
                    body: JSON.stringify(trainingData),
                    headers: { 'Content-Type': 'application/json' }
                });

                // Calcular erro após cada treinamento
                const result = await this.fetchWithRetry(`${this.baseUrl}/generate`, {
                    method: 'POST',
                    body: JSON.stringify({
                        model: modelName,
                        prompt: example.prompt
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                const predicted = parseInt(result.response.match(/\d+/)?.[0] || '0');
                const actual = parseInt(example.completion.match(/\d+/)?.[0] || '0');
                const error = Math.abs(predicted - actual);
                totalError += error;
                totalExamples++;

                console.log(`✅ Exemplo ${i + 1}/${trainExamples.length} processado`);
                console.log(`📊 Erro médio atual: ${(totalError / totalExamples).toFixed(2)}`);
                await this.delay(100);
            }

            // Validação do modelo
            console.log('\n🔍 Iniciando validação do modelo...');
            let validationError = 0;
            let validationCount = 0;

            for (const example of validationSet) {
                const result = await this.fetchWithRetry(`${this.baseUrl}/generate`, {
                    method: 'POST',
                    body: JSON.stringify({
                        model: modelName,
                        prompt: example.prompt
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                const predicted = parseInt(result.response.match(/\d+/)?.[0] || '0');
                const actual = parseInt(example.completion.match(/\d+/)?.[0] || '0');
                const error = Math.abs(predicted - actual);
                validationError += error;
                validationCount++;

                console.log(`\n📝 Exemplo de validação:`);
                console.log('Prompt:', example.prompt);
                console.log('Previsão:', predicted);
                console.log('Real:', actual);
                console.log(`Erro: ${error}`);
            }

            console.log(`\n📊 Métricas finais:`);
            console.log(`Erro médio de treino: ${(totalError / totalExamples).toFixed(2)}`);
            console.log(`Erro médio de validação: ${(validationError / validationCount).toFixed(2)}`);

        } catch (error) {
            console.error('❌ Erro ao criar/treinar modelo no Ollama:', error);
            throw error;
        }
    }

    public async trainModel(): Promise<void> {
        try {
            console.log('\n🚀 Iniciando processo de treinamento do modelo...');
            console.log('===============================================');
            
            console.log('\n📊 Gerando exemplos de treinamento...');
            const examples = this.generateTrainingExamples();
            console.log(`✅ Gerados ${examples.length} exemplos de treinamento`);

            console.log('\n🤖 Iniciando treinamento no Ollama...');
            await this.createModelInOllama('nimage', examples);
            
            console.log('\n🎉 Treinamento concluído com sucesso!');
            console.log('===============================================');

            // Testar o modelo
            console.log('\n🧪 Testando o modelo com alguns exemplos:');
            for (let i = 0; i < 3 && i < examples.length; i++) {
                console.log(`\n📝 Exemplo ${i + 1}:`);
                console.log('Prompt:', examples[i].prompt);
                
                const result = await this.fetchWithRetry(`${this.baseUrl}/generate`, {
                    method: 'POST',
                    body: JSON.stringify({
                        model: 'nimage',
                        prompt: examples[i].prompt
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                console.log('Resposta:', result.response);
                console.log('Real:', examples[i].completion);
                await this.delay(1000);
            }

        } catch (error) {
            console.error('\n❌ Erro durante o treinamento:', error);
            throw error;
        }
    }
}

// Executar treinamento
const trainer = new LocalOllamaTrainer();
trainer.trainModel().catch(console.error); 