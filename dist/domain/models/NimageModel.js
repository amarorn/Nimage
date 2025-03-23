"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NimageModel = void 0;
const tf = __importStar(require("@tensorflow/tfjs"));
const fs = __importStar(require("fs"));
class NimageModel {
    constructor() {
        this.model = null;
        this.equipeEncoder = new Map();
        this.vendedorEncoder = new Map();
        this.maxMeta = 100000;
        this.maxDocinhos = 50000;
        this.meanDocinhos = 0;
        this.stdDocinhos = 1;
        this.meanMeta = 0;
        this.stdMeta = 1;
        this.minDocinhos = 0;
        this.minMeta = 0;
        this.vendedorStats = new Map();
        this.equipeStats = new Map();
        this.model = this.buildModel();
    }
    buildModel() {
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
    encodeInput(input) {
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
    calculateStatistics(examples) {
        const docinhos = examples.map(e => e.output.docinhosCoco);
        const metas = examples.map(e => e.input.meta);
        // Estatísticas para docinhos
        this.maxDocinhos = Math.max(...docinhos);
        this.minDocinhos = Math.min(...docinhos);
        this.meanDocinhos = docinhos.reduce((a, b) => a + b, 0) / docinhos.length;
        this.stdDocinhos = Math.sqrt(docinhos.map(x => Math.pow(x - this.meanDocinhos, 2))
            .reduce((a, b) => a + b, 0) / docinhos.length);
        // Estatísticas para metas
        this.maxMeta = Math.max(...metas);
        this.minMeta = Math.min(...metas);
        this.meanMeta = metas.reduce((a, b) => a + b, 0) / metas.length;
        this.stdMeta = Math.sqrt(metas.map(x => Math.pow(x - this.meanMeta, 2))
            .reduce((a, b) => a + b, 0) / metas.length);
        // Calcular estatísticas por vendedor
        const vendedorDados = new Map();
        examples.forEach((e, index) => {
            const vendedor = e.input.vendedor;
            if (!vendedorDados.has(vendedor)) {
                vendedorDados.set(vendedor, { valores: [], dias: [], meses: [], metas: [], datas: [] });
            }
            const dados = vendedorDados.get(vendedor);
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
        const equipeDados = new Map();
        examples.forEach((e, index) => {
            const equipe = e.input.equipe;
            if (!equipeDados.has(equipe)) {
                equipeDados.set(equipe, { valores: [], dias: [], meses: [], metas: [], datas: [] });
            }
            const dados = equipeDados.get(equipe);
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
    async train(examples) {
        if (!this.model)
            throw new Error('Modelo não inicializado');
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
        await this.model.fit(tf.concat(inputs, 0), outputs, {
            epochs: 150,
            batchSize: 32,
            validationSplit: 0.2,
            shuffle: true,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    var _a;
                    if (logs) {
                        console.log(`Época ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, val_loss = ${((_a = logs.val_loss) === null || _a === void 0 ? void 0 : _a.toFixed(4)) || 'N/A'}`);
                        if (logs.val_loss < bestValLoss) {
                            bestValLoss = logs.val_loss;
                            patienceCount = 0;
                        }
                        else {
                            patienceCount++;
                            if (patienceCount >= patience && this.model) {
                                console.log('Early stopping triggered');
                                this.model.stopTraining = true;
                            }
                        }
                    }
                }
            }
        });
        // Limpar tensores
        inputs.forEach(t => t.dispose());
        outputs.dispose();
    }
    async predict(input) {
        if (!this.model)
            throw new Error('Modelo não inicializado');
        const inputTensor = this.encodeInput(input);
        const prediction = this.model.predict(inputTensor);
        const value = await prediction.data();
        inputTensor.dispose();
        prediction.dispose();
        // Desnormalizar
        const denormalizedValue = value[0] * this.maxDocinhos;
        return { docinhosCoco: Math.round(Math.max(0, denormalizedValue)) };
    }
    async save(filePath) {
        if (!this.model)
            throw new Error('Modelo não inicializado');
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
        fs.writeFileSync(filePath.replace('.json', '_metadata.json'), JSON.stringify(metadata, null, 2));
    }
    async load(filePath) {
        const modelJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        this.model = await tf.models.modelFromJSON(modelJson);
        const metadata = JSON.parse(fs.readFileSync(filePath.replace('.json', '_metadata.json'), 'utf-8'));
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
exports.NimageModel = NimageModel;
//# sourceMappingURL=NimageModel.js.map