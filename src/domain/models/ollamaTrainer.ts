import { AtividadeRepositoryImpl } from '../../infrastructure/repositories/AtividadeRepositoryImpl';
import { VendedorRepositoryImpl } from '../../infrastructure/repositories/VendedorRepositoryImpl';
import { EquipeRepositoryImpl } from '../../infrastructure/repositories/EquipeRepositoryImpl';
import { MetaRepositoryImpl } from '../../infrastructure/repositories/MetaRepositoryImpl';
import { MongoDB } from '../../infrastructure/database/MongoDB';
import fetch from 'node-fetch';

interface TrainingExample {
    prompt: string;
    completion: string;
}

export class OllamaTrainer {
    private atividadeRepo: AtividadeRepositoryImpl;
    private vendedorRepo: VendedorRepositoryImpl;
    private equipeRepo: EquipeRepositoryImpl;
    private metaRepo: MetaRepositoryImpl;
    private baseUrl: string;

    constructor() {
        this.atividadeRepo = new AtividadeRepositoryImpl();
        this.vendedorRepo = new VendedorRepositoryImpl();
        this.equipeRepo = new EquipeRepositoryImpl();
        this.metaRepo = new MetaRepositoryImpl();
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

    private async prepareTrainingData(): Promise<TrainingExample[]> {
        try {
            // Conectar ao MongoDB
            console.log('Conectando ao MongoDB...');
            await MongoDB.conectar();
            console.log('Conectado ao MongoDB com sucesso!');

            // Buscar todas as atividades
            const atividades = await this.atividadeRepo.obterTodos(0, 1000);
            const examples: TrainingExample[] = [];

            for (const atividade of atividades) {
                try {
                    const vendedor = await this.vendedorRepo.obterPorId(atividade.vendedorId);
                    if (!vendedor) continue;

                    const equipe = await this.equipeRepo.obterPorId(vendedor.equipe_id);
                    if (!equipe) continue;

                    const meta = await this.metaRepo.obterPorEquipe(equipe.id);
                    if (!meta) continue;

                    // Criar prompt no formato natural
                    const prompt = `
Data: ${atividade.data.toISOString().split('T')[0]}
Dia da semana: ${atividade.data.getDay()}
Mês: ${atividade.data.getMonth() + 1}
Vendedor: ${vendedor.nome}
Equipe: ${equipe.nome}
Meta da equipe: ${meta.objetivo}
É fim de semana? ${atividade.data.getDay() === 0 || atividade.data.getDay() === 6 ? 'Sim' : 'Não'}

Baseado nessas informações, quantos docinhos serão vendidos?`;

                    // A resposta real
                    const completion = `Com base nos dados fornecidos, a previsão de vendas é de ${atividade.docinhosCoco} docinhos.`;

                    examples.push({ prompt, completion });
                } catch (error) {
                    console.error(`Erro ao processar atividade ${atividade.id}:`, error);
                    continue;
                }
            }

            return examples;
        } catch (error) {
            console.error('Erro ao preparar dados de treinamento:', error);
            throw error;
        }
    }

    private async createModelInOllama(modelName: string, examples: TrainingExample[]): Promise<void> {
        try {
            const modelConfig = {
                name: modelName,
                system: `Você é um assistente especializado em prever vendas de docinhos. 
                Use os dados fornecidos para fazer previsões precisas baseadas em padrões históricos.
                Considere fatores como dia da semana, mês, vendedor, equipe e metas.
                Responda apenas com números, sem explicações adicionais.`,
                format: "prompt: {{.Input}}\ncompletion: {{.Output}}",
                parameters: {
                    num_ctx: 4096,
                    num_thread: 4,
                    repeat_last_n: 64,
                    temperature: 0.7,
                    top_k: 40,
                    top_p: 0.9
                }
            };

            // Criar o modelo base
            console.log('Criando modelo base...');
            await this.fetchWithRetry(`${this.baseUrl}/create`, {
                method: 'POST',
                body: JSON.stringify(modelConfig),
                headers: { 'Content-Type': 'application/json' }
            });

            // Treinar o modelo com os exemplos
            console.log('Iniciando treinamento com exemplos...');
            for (let i = 0; i < examples.length; i++) {
                const example = examples[i];
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

                console.log(`Exemplo ${i + 1}/${examples.length} processado`);
                await this.delay(100); // Pequeno delay entre as chamadas
            }
        } catch (error) {
            console.error('Erro ao criar/treinar modelo no Ollama:', error);
            throw error;
        }
    }

    public async trainModel(): Promise<void> {
        try {
            console.log('\n🚀 Iniciando processo de treinamento do modelo...');
            console.log('===============================================');
            
            console.log('\n📊 Preparando dados de treinamento...');
            const examples = await this.prepareTrainingData();
            console.log(`✅ Carregados ${examples.length} exemplos de treinamento`);

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
const trainer = new OllamaTrainer();
trainer.trainModel().catch(console.error);