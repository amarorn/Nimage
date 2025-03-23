import * as fs from 'fs';
import * as path from 'path';
import { NimageModel } from '../domain/models/NimageModel';

interface TrainingData {
    equipe: string;
    vendedor: string;
    data: string;
    diaSemana: number;
    mes: number;
    diaMes: number;
    feriado: boolean;
    meta: number;
    docinhosCoco: number;
}

async function loadTrainingData(): Promise<TrainingData[]> {
    const filePath = path.join(__dirname, '../../data/training_data.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
}

async function main() {
    try {
        // Carregar dados de treinamento
        const trainingData = await loadTrainingData();
        console.log(`Carregados ${trainingData.length} registros de treinamento\n`);

        // Criar e treinar o modelo
        const model = new NimageModel();

        // Converter dados para o formato esperado pelo modelo
        const trainingExamples = trainingData.map(data => ({
            input: {
                equipe: data.equipe,
                vendedor: data.vendedor,
                diaSemana: data.diaSemana,
                mes: data.mes,
                diaMes: data.diaMes,
                feriado: data.feriado,
                meta: data.meta,
                data: data.data
            },
            output: {
                docinhosCoco: data.docinhosCoco
            }
        }));

        console.log('Iniciando treinamento do modelo...');
        await model.train(trainingExamples);
        console.log('Treinamento concluído com sucesso!');

        // Salvar o modelo
        const modelPath = path.join(__dirname, '../../models/nimage_model.json');
        await model.save(modelPath);
        console.log(`Modelo salvo em: ${modelPath}\n`);

        // Testar o modelo com alguns exemplos
        console.log('Testando o modelo com alguns exemplos:\n');
        const testExamples = trainingData.slice(-5);

        for (const example of testExamples) {
            const prediction = await model.predict({
                equipe: example.equipe,
                vendedor: example.vendedor,
                diaSemana: example.diaSemana,
                mes: example.mes,
                diaMes: example.diaMes,
                feriado: example.feriado,
                meta: example.meta,
                data: example.data
            });

            console.log(`Data: ${example.data}`);
            console.log(`Equipe: ${example.equipe}`);
            console.log(`Vendedor: ${example.vendedor}`);
            console.log(`Meta: ${example.meta}`);
            console.log(`Real: ${example.docinhosCoco}`);
            console.log(`Previsto: ${prediction.docinhosCoco}`);
            console.log(`Erro: ${Math.abs(example.docinhosCoco - prediction.docinhosCoco)}\n`);
        }
    } catch (error) {
        console.error('Erro durante o treinamento:', error);
        process.exit(1);
    }
}

main(); 