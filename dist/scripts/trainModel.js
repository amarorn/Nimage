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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const NimageModel_1 = require("../domain/models/NimageModel");
function loadTrainingData() {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path.join(__dirname, '../../data/training_data.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(rawData);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Carregar dados de treinamento
            const trainingData = yield loadTrainingData();
            console.log(`Carregados ${trainingData.length} registros de treinamento\n`);
            // Criar e treinar o modelo
            const model = new NimageModel_1.NimageModel();
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
            yield model.train(trainingExamples);
            console.log('Treinamento concluído com sucesso!');
            // Salvar o modelo
            const modelPath = path.join(__dirname, '../../models/nimage_model.json');
            yield model.save(modelPath);
            console.log(`Modelo salvo em: ${modelPath}\n`);
            // Testar o modelo com alguns exemplos
            console.log('Testando o modelo com alguns exemplos:\n');
            const testExamples = trainingData.slice(-5);
            for (const example of testExamples) {
                const prediction = yield model.predict({
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
        }
        catch (error) {
            console.error('Erro durante o treinamento:', error);
            process.exit(1);
        }
    });
}
main();
//# sourceMappingURL=trainModel.js.map