import * as tf from '@tensorflow/tfjs';
import { AtividadeRepositoryImpl } from '../../infrastructure/repositories/AtividadeRepositoryImpl';
import { VendedorRepositoryImpl } from '../../infrastructure/repositories/VendedorRepositoryImpl';
import { EquipeRepositoryImpl } from '../../infrastructure/repositories/EquipeRepositoryImpl';
import { MetaRepositoryImpl } from '../../infrastructure/repositories/MetaRepositoryImpl';
import { MongoDB } from '../../infrastructure/database/MongoDB';

interface TrainingData {
    features: number[][];
    labels: number[];
}

export class ModelTrainer {
    private atividadeRepo: AtividadeRepositoryImpl;
    private vendedorRepo: VendedorRepositoryImpl;
    private equipeRepo: EquipeRepositoryImpl;
    private metaRepo: MetaRepositoryImpl;

    constructor() {
        this.atividadeRepo = new AtividadeRepositoryImpl();
        this.vendedorRepo = new VendedorRepositoryImpl();
        this.equipeRepo = new EquipeRepositoryImpl();
        this.metaRepo = new MetaRepositoryImpl();
    }

    private async prepareTrainingData(): Promise<TrainingData> {
        // Buscar todas as atividades
        const atividades = await this.atividadeRepo.obterTodos(0, 1000); // Limitando a 1000 registros para teste
        
        const features: number[][] = [];
        const labels: number[] = [];

        for (const atividade of atividades) {
            const vendedor = await this.vendedorRepo.obterPorId(atividade.vendedorId);
            if (!vendedor) continue;

            const equipe = await this.equipeRepo.obterPorId(vendedor.equipeId);
            if (!equipe) continue;

            const meta = await this.metaRepo.obterPorEquipe(equipe.id);
            if (!meta) continue;

            // Features simplificadas
            const featureVector = [
                atividade.data.getDay(), // dia da semana (0-6)
                atividade.data.getMonth() + 1, // mês (1-12)
                meta.objetivo / 10000, // meta normalizada
                atividade.data.getDay() === 0 ? 1 : 0, // é domingo?
                atividade.data.getDay() === 6 ? 1 : 0, // é sábado?
            ];

            features.push(featureVector);
            labels.push(atividade.docinhosCoco / 1000); // normalização dos docinhos
        }

        return { features, labels };
    }

    private createModel(): tf.LayersModel {
        const model = tf.sequential();

        // Camada de entrada
        model.add(tf.layers.dense({
            units: 32,
            activation: 'relu',
            inputShape: [5]
        }));

        // Camada de saída
        model.add(tf.layers.dense({
            units: 1,
            activation: 'relu'
        }));

        // Compilação do modelo
        model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'meanSquaredError',
            metrics: ['mae']
        });

        return model;
    }

    public async trainModel(): Promise<void> {
        try {
            // Conectar ao MongoDB
            console.log('Conectando ao MongoDB...');
            await MongoDB.conectar();
            console.log('Conectado ao MongoDB com sucesso!');

            console.log('Preparando dados de treinamento...');
            const { features, labels } = await this.prepareTrainingData();
            
            console.log(`Carregados ${features.length} registros de treinamento`);

            // Converter para tensores
            const xs = tf.tensor2d(features);
            const ys = tf.tensor2d(labels, [labels.length, 1]);

            // Criar e treinar o modelo
            const model = this.createModel();
            
            console.log('Iniciando treinamento...');
            
            await model.fit(xs, ys, {
                epochs: 50,
                batchSize: 32,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: (epoch: number, logs?: tf.Logs) => {
                        if (logs) {
                            console.log(`Época ${epoch + 1} - Loss: ${logs.loss.toFixed(4)} - Val Loss: ${logs.val_loss.toFixed(4)}`);
                        }
                    }
                }
            });

            // Salvar o modelo
            await model.save('indexeddb://nimage_model');
            console.log('Modelo salvo com sucesso!');

            // Testar o modelo
            console.log('\nTestando o modelo com alguns exemplos:');
            const testData = xs.slice([0, 5]);
            const predictions = model.predict(testData) as tf.Tensor;
            const actualValues = ys.slice([0, 5]);
            
            const predArray = await predictions.array() as number[][];
            const actualArray = await actualValues.array() as number[][];
            
            for (let i = 0; i < 5; i++) {
                console.log(`Exemplo ${i + 1}:`);
                console.log(`Previsto: ${(predArray[i][0] * 1000).toFixed(0)}`);
                console.log(`Real: ${(actualArray[i][0] * 1000).toFixed(0)}`);
                console.log(`Erro: ${Math.abs((predArray[i][0] - actualArray[i][0]) * 1000).toFixed(0)}`);
                console.log('---');
            }

            // Limpar memória
            xs.dispose();
            ys.dispose();
            model.dispose();

        } catch (error) {
            console.error('Erro durante o treinamento:', error);
            throw error;
        }
    }
}

// Executar treinamento
const trainer = new ModelTrainer();
trainer.trainModel().catch(console.error);