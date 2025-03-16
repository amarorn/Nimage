import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';

interface TrainingExample {
    input: {
        equipe: string;
        vendedor: string;
        diaSemana: number;
        mes: number;
        diaMes: number;
        feriado: boolean;
        meta: number;
        data: string;
    };
    output: {
        docinhosCoco: number;
    };
}

interface PredictionInput {
    equipe: string;
    vendedor: string;
    diaSemana: number;
    mes: number;
    diaMes: number;
    feriado: boolean;
    meta: number;
    data: string;
}

interface TrainingLogs extends tf.Logs {
    loss: number;
    val_loss: number;
}

interface VendedorStats {
    mediaGeral: number;
    mediaPonderada: number;
    mediaDiaSemana: number[];
    mediaMes: number[];
    metaRatio: number;
    sazonalidade: number;
}

interface EquipeStats {
    mediaGeral: number;
    mediaPonderada: number;
    mediaDiaSemana: number[];
    mediaMes: number[];
    metaRatio: number;
    sazonalidade: number;
}

export class NimageModel {
    private model: tf.LayersModel | null = null;
    private equipeEncoder: Map<string, number> = new Map();
    private vendedorEncoder: Map<string, number> = new Map();
    private maxMeta: number = 100000;
    private maxDocinhos: number = 50000;
    private meanDocinhos: number = 0;
    private stdDocinhos: number = 1;
    private meanMeta: number = 0;
    private stdMeta: number = 1;
    private minDocinhos: number = 0;
    private minMeta: number = 0;
    private vendedorStats: Map<string, VendedorStats> = new Map();
    private equipeStats: Map<string, EquipeStats> = new Map();

    constructor() {
        this.model = this.buildModel();
    }

    private buildModel(): tf.LayersModel {
        const model = tf.sequential();

        // Camada de entrada
        model.add(tf.layers.dense({
            units: 16,
            activation: 'relu',
            inputShape: [15],
            kernelInitializer: 'glorotNormal',
            kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
        }));

        // Camada de saída
        model.add(tf.layers.dense({
            units: 1,
            activation: 'relu',
            kernelInitializer: 'glorotNormal'
        }));

        const optimizer = tf.train.rmsprop(0.001);
        model.compile({
            optimizer: optimizer,
            loss: 'meanSquaredError',
            metrics: ['mae']
        });

        return model;
    }

    private encodeInput(input: PredictionInput): tf.Tensor {
        const equipeIndex = this.equipeEncoder.get(input.equipe) || 0;
        const vendedorIndex = this.vendedorEncoder.get(input.vendedor) || 0;
        const vendedorStat = this.vendedorStats.get(input.vendedor) || {
            mediaGeral: this.meanDocinhos,
            mediaPonderada: this.meanDocinhos,
            mediaDiaSemana: Array(7).fill(this.meanDocinhos),
            mediaMes: Array(12).fill(this.meanDocinhos),
            metaRatio: 1,
            sazonalidade: 1
        };
        const equipeStat = this.equipeStats.get(input.equipe) || {
            mediaGeral: this.meanDocinhos,
            mediaPonderada: this.meanDocinhos,
            mediaDiaSemana: Array(7).fill(this.meanDocinhos),
            mediaMes: Array(12).fill(this.meanDocinhos),
            metaRatio: 1,
            sazonalidade: 1
        };

        // Normalização dos dados de entrada
        const normalizedInput = [
            equipeIndex / Math.max(1, this.equipeEncoder.size - 1),
            vendedorIndex / Math.max(1, this.vendedorEncoder.size - 1),
            Math.sin(2 * Math.PI * input.diaSemana / 7),
            Math.cos(2 * Math.PI * input.diaSemana / 7),
            Math.sin(2 * Math.PI * input.mes / 12),
            Math.cos(2 * Math.PI * input.mes / 12),
            input.diaMes / 31,
            input.feriado ? 1 : 0,
            vendedorStat.mediaGeral / this.maxDocinhos,
            vendedorStat.mediaPonderada / this.maxDocinhos,
            vendedorStat.mediaDiaSemana[input.diaSemana] / this.maxDocinhos,
            vendedorStat.mediaMes[input.mes - 1] / this.maxDocinhos,
            equipeStat.mediaPonderada / this.maxDocinhos,
            equipeStat.mediaDiaSemana[input.diaSemana] / this.maxDocinhos,
            input.meta / this.maxMeta
        ];

        return tf.tensor2d([normalizedInput]);
    }

    private calculateStatistics(examples: TrainingExample[]): void {
        const docinhos = examples.map(e => e.output.docinhosCoco);
        const metas = examples.map(e => e.input.meta);

        // Estatísticas para docinhos
        this.maxDocinhos = Math.max(...docinhos);
        this.minDocinhos = Math.min(...docinhos);
        this.meanDocinhos = docinhos.reduce((a, b) => a + b, 0) / docinhos.length;
        this.stdDocinhos = Math.sqrt(
            docinhos.map(x => Math.pow(x - this.meanDocinhos, 2))
                   .reduce((a, b) => a + b, 0) / docinhos.length
        );

        // Estatísticas para metas
        this.maxMeta = Math.max(...metas);
        this.minMeta = Math.min(...metas);
        this.meanMeta = metas.reduce((a, b) => a + b, 0) / metas.length;
        this.stdMeta = Math.sqrt(
            metas.map(x => Math.pow(x - this.meanMeta, 2))
                 .reduce((a, b) => a + b, 0) / metas.length
        );

        // Calcular estatísticas por vendedor
        const vendedorDados = new Map<string, { valores: number[]; dias: number[]; meses: number[]; metas: number[]; datas: Date[] }>();
        examples.forEach((e, index) => {
            const vendedor = e.input.vendedor;
            if (!vendedorDados.has(vendedor)) {
                vendedorDados.set(vendedor, { valores: [], dias: [], meses: [], metas: [], datas: [] });
            }
            const dados = vendedorDados.get(vendedor)!;
            dados.valores.push(e.output.docinhosCoco);
            dados.dias.push(e.input.diaSemana);
            dados.meses.push(e.input.mes);
            dados.metas.push(e.input.meta);
            dados.datas.push(new Date(e.input.data));
        });

        vendedorDados.forEach((dados, vendedor) => {
            const { valores, dias, meses, metas, datas } = dados;
            const mediaGeral = valores.reduce((a, b) => a + b, 0) / valores.length;

            // Média ponderada por recência
            const pesos = valores.map((_, i) => Math.exp(-0.02 * (valores.length - i - 1)));
            const somaPesos = pesos.reduce((a, b) => a + b, 0);
            const mediaPonderada = valores.reduce((acc, val, i) => acc + val * pesos[i], 0) / somaPesos;

            // Médias por dia da semana com pesos
            const mediaDiaSemana = Array(7).fill(0);
            const pesoDiaSemana = Array(7).fill(0);
            for (let i = 0; i < valores.length; i++) {
                const peso = Math.exp(-0.02 * (valores.length - i - 1));
                mediaDiaSemana[dias[i]] += valores[i] * peso;
                pesoDiaSemana[dias[i]] += peso;
            }
            for (let i = 0; i < 7; i++) {
                mediaDiaSemana[i] = pesoDiaSemana[i] > 0 ? 
                    mediaDiaSemana[i] / pesoDiaSemana[i] : mediaGeral;
            }

            // Médias por mês com pesos
            const mediaMes = Array(12).fill(0);
            const pesoMes = Array(12).fill(0);
            for (let i = 0; i < valores.length; i++) {
                const peso = Math.exp(-0.02 * (valores.length - i - 1));
                mediaMes[meses[i] - 1] += valores[i] * peso;
                pesoMes[meses[i] - 1] += peso;
            }
            for (let i = 0; i < 12; i++) {
                mediaMes[i] = pesoMes[i] > 0 ? 
                    mediaMes[i] / pesoMes[i] : mediaGeral;
            }

            // Calcular ratio médio entre meta e vendas
            const ratios = valores.map((val, i) => val / metas[i]);
            const metaRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;

            // Calcular sazonalidade
            const sazonalidade = Math.max(0.5, Math.min(2, mediaDiaSemana[dias[dias.length - 1]] / mediaGeral));

            this.vendedorStats.set(vendedor, {
                mediaGeral,
                mediaPonderada,
                mediaDiaSemana,
                mediaMes,
                metaRatio,
                sazonalidade
            });
        });

        // Calcular estatísticas por equipe
        const equipeDados = new Map<string, { valores: number[]; dias: number[]; meses: number[]; metas: number[]; datas: Date[] }>();
        examples.forEach((e, index) => {
            const equipe = e.input.equipe;
            if (!equipeDados.has(equipe)) {
                equipeDados.set(equipe, { valores: [], dias: [], meses: [], metas: [], datas: [] });
            }
            const dados = equipeDados.get(equipe)!;
            dados.valores.push(e.output.docinhosCoco);
            dados.dias.push(e.input.diaSemana);
            dados.meses.push(e.input.mes);
            dados.metas.push(e.input.meta);
            dados.datas.push(new Date(e.input.data));
        });

        equipeDados.forEach((dados, equipe) => {
            const { valores, dias, meses, metas, datas } = dados;
            const mediaGeral = valores.reduce((a, b) => a + b, 0) / valores.length;

            // Média ponderada por recência
            const pesos = valores.map((_, i) => Math.exp(-0.02 * (valores.length - i - 1)));
            const somaPesos = pesos.reduce((a, b) => a + b, 0);
            const mediaPonderada = valores.reduce((acc, val, i) => acc + val * pesos[i], 0) / somaPesos;

            // Médias por dia da semana com pesos
            const mediaDiaSemana = Array(7).fill(0);
            const pesoDiaSemana = Array(7).fill(0);
            for (let i = 0; i < valores.length; i++) {
                const peso = Math.exp(-0.02 * (valores.length - i - 1));
                mediaDiaSemana[dias[i]] += valores[i] * peso;
                pesoDiaSemana[dias[i]] += peso;
            }
            for (let i = 0; i < 7; i++) {
                mediaDiaSemana[i] = pesoDiaSemana[i] > 0 ? 
                    mediaDiaSemana[i] / pesoDiaSemana[i] : mediaGeral;
            }

            // Médias por mês com pesos
            const mediaMes = Array(12).fill(0);
            const pesoMes = Array(12).fill(0);
            for (let i = 0; i < valores.length; i++) {
                const peso = Math.exp(-0.02 * (valores.length - i - 1));
                mediaMes[meses[i] - 1] += valores[i] * peso;
                pesoMes[meses[i] - 1] += peso;
            }
            for (let i = 0; i < 12; i++) {
                mediaMes[i] = pesoMes[i] > 0 ? 
                    mediaMes[i] / pesoMes[i] : mediaGeral;
            }

            // Calcular ratio médio entre meta e vendas
            const ratios = valores.map((val, i) => val / metas[i]);
            const metaRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;

            // Calcular sazonalidade
            const sazonalidade = Math.max(0.5, Math.min(2, mediaDiaSemana[dias[dias.length - 1]] / mediaGeral));

            this.equipeStats.set(equipe, {
                mediaGeral,
                mediaPonderada,
                mediaDiaSemana,
                mediaMes,
                metaRatio,
                sazonalidade
            });
        });
    }

    public async train(examples: TrainingExample[]): Promise<void> {
        if (!this.model) throw new Error('Modelo não inicializado');

        // Criar encoders
        const equipes = new Set(examples.map(e => e.input.equipe));
        const vendedores = new Set(examples.map(e => e.input.vendedor));

        Array.from(equipes).forEach((equipe, index) => {
            this.equipeEncoder.set(equipe, index);
        });

        Array.from(vendedores).forEach((vendedor, index) => {
            this.vendedorEncoder.set(vendedor, index);
        });

        // Calcular estatísticas
        this.calculateStatistics(examples);

        // Preparar dados
        const inputs = examples.map(e => this.encodeInput(e.input));
        const outputs = tf.tensor2d(examples.map(e => [e.output.docinhosCoco / this.maxDocinhos]));

        // Early stopping
        let bestValLoss = Infinity;
        let patience = 15;
        let patienceCount = 0;

        // Treinar
        await this.model.fit(
            tf.concat(inputs, 0),
            outputs,
            {
                epochs: 150,
                batchSize: 32,
                validationSplit: 0.2,
                shuffle: true,
                callbacks: {
                    onEpochEnd: async (epoch: number, logs?: tf.Logs) => {
                        if (logs) {
                            console.log(`Época ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, val_loss = ${logs.val_loss?.toFixed(4) || 'N/A'}`);
                            
                            if (logs.val_loss < bestValLoss) {
                                bestValLoss = logs.val_loss;
                                patienceCount = 0;
                            } else {
                                patienceCount++;
                                if (patienceCount >= patience && this.model) {
                                    console.log('Early stopping triggered');
                                    this.model.stopTraining = true;
                                }
                            }
                        }
                    }
                }
            }
        );

        // Limpar tensores
        inputs.forEach(t => t.dispose());
        outputs.dispose();
    }

    public async predict(input: PredictionInput): Promise<{ docinhosCoco: number }> {
        if (!this.model) throw new Error('Modelo não inicializado');

        const inputTensor = this.encodeInput(input);
        const prediction = this.model.predict(inputTensor) as tf.Tensor;
        const value = await prediction.data();
        
        inputTensor.dispose();
        prediction.dispose();

        // Desnormalizar
        const denormalizedValue = value[0] * this.maxDocinhos;
        return { docinhosCoco: Math.round(Math.max(0, denormalizedValue)) };
    }

    public async save(filePath: string): Promise<void> {
        if (!this.model) throw new Error('Modelo não inicializado');

        const modelJson = this.model.toJSON();
        fs.writeFileSync(filePath, JSON.stringify(modelJson));

        const metadata = {
            equipe: Object.fromEntries(this.equipeEncoder),
            vendedor: Object.fromEntries(this.vendedorEncoder),
            maxMeta: this.maxMeta,
            minMeta: this.minMeta,
            maxDocinhos: this.maxDocinhos,
            minDocinhos: this.minDocinhos,
            meanDocinhos: this.meanDocinhos,
            stdDocinhos: this.stdDocinhos,
            meanMeta: this.meanMeta,
            stdMeta: this.stdMeta,
            vendedorStats: Object.fromEntries(this.vendedorStats),
            equipeStats: Object.fromEntries(this.equipeStats)
        };

        fs.writeFileSync(
            filePath.replace('.json', '_metadata.json'),
            JSON.stringify(metadata, null, 2)
        );
    }

    public async load(filePath: string): Promise<void> {
        const modelJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        this.model = await tf.models.modelFromJSON(modelJson);

        const metadata = JSON.parse(
            fs.readFileSync(filePath.replace('.json', '_metadata.json'), 'utf-8')
        );

        this.equipeEncoder = new Map(Object.entries(metadata.equipe));
        this.vendedorEncoder = new Map(Object.entries(metadata.vendedor));
        this.maxMeta = metadata.maxMeta;
        this.minMeta = metadata.minMeta;
        this.maxDocinhos = metadata.maxDocinhos;
        this.minDocinhos = metadata.minDocinhos;
        this.meanDocinhos = metadata.meanDocinhos;
        this.stdDocinhos = metadata.stdDocinhos;
        this.meanMeta = metadata.meanMeta;
        this.stdMeta = metadata.stdMeta;
        this.vendedorStats = new Map(Object.entries(metadata.vendedorStats));
        this.equipeStats = new Map(Object.entries(metadata.equipeStats));
    }
}