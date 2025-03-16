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
exports.ModelTrainer = void 0;
const tf = __importStar(require("@tensorflow/tfjs"));
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const MongoDB_1 = require("../../infrastructure/database/MongoDB");
class ModelTrainer {
    constructor() {
        this.atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
        this.vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
        this.equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
        this.metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
    }
    prepareTrainingData() {
        return __awaiter(this, void 0, void 0, function* () {
            // Buscar todas as atividades
            const atividades = yield this.atividadeRepo.obterTodos(0, 1000); // Limitando a 1000 registros para teste
            const features = [];
            const labels = [];
            for (const atividade of atividades) {
                const vendedor = yield this.vendedorRepo.obterPorId(atividade.vendedorId);
                if (!vendedor)
                    continue;
                const equipe = yield this.equipeRepo.obterPorId(vendedor.equipe_id);
                if (!equipe)
                    continue;
                const meta = yield this.metaRepo.obterPorEquipe(equipe.id);
                if (!meta)
                    continue;
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
        });
    }
    createModel() {
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
    trainModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Conectar ao MongoDB
                console.log('Conectando ao MongoDB...');
                yield MongoDB_1.MongoDB.conectar();
                console.log('Conectado ao MongoDB com sucesso!');
                console.log('Preparando dados de treinamento...');
                const { features, labels } = yield this.prepareTrainingData();
                console.log(`Carregados ${features.length} registros de treinamento`);
                // Converter para tensores
                const xs = tf.tensor2d(features);
                const ys = tf.tensor2d(labels, [labels.length, 1]);
                // Criar e treinar o modelo
                const model = this.createModel();
                console.log('Iniciando treinamento...');
                yield model.fit(xs, ys, {
                    epochs: 50,
                    batchSize: 32,
                    validationSplit: 0.2,
                    callbacks: {
                        onEpochEnd: (epoch, logs) => {
                            if (logs) {
                                console.log(`Época ${epoch + 1} - Loss: ${logs.loss.toFixed(4)} - Val Loss: ${logs.val_loss.toFixed(4)}`);
                            }
                        }
                    }
                });
                // Salvar o modelo
                yield model.save('indexeddb://nimage_model');
                console.log('Modelo salvo com sucesso!');
                // Testar o modelo
                console.log('\nTestando o modelo com alguns exemplos:');
                const testData = xs.slice([0, 5]);
                const predictions = model.predict(testData);
                const actualValues = ys.slice([0, 5]);
                const predArray = yield predictions.array();
                const actualArray = yield actualValues.array();
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
            }
            catch (error) {
                console.error('Erro durante o treinamento:', error);
                throw error;
            }
        });
    }
}
exports.ModelTrainer = ModelTrainer;
// Executar treinamento
const trainer = new ModelTrainer();
trainer.trainModel().catch(console.error);
