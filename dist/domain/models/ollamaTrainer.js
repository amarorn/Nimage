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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaTrainer = void 0;
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const MongoDB_1 = require("../../infrastructure/database/MongoDB");
const node_fetch_1 = __importDefault(require("node-fetch"));
class OllamaTrainer {
    constructor() {
        this.atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
        this.vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
        this.equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
        this.metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434/api';
    }
    delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
    fetchWithRetry(url_1, options_1) {
        return __awaiter(this, arguments, void 0, function* (url, options, maxRetries = 3) {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    const response = yield (0, node_fetch_1.default)(url, options);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return yield response.json();
                }
                catch (error) {
                    if (i === maxRetries - 1)
                        throw error;
                    console.log(`Tentativa ${i + 1} falhou, tentando novamente em 2 segundos...`);
                    yield this.delay(2000);
                }
            }
        });
    }
    prepareTrainingData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Conectar ao MongoDB
                console.log('Conectando ao MongoDB...');
                yield MongoDB_1.MongoDB.conectar();
                console.log('Conectado ao MongoDB com sucesso!');
                // Buscar todas as atividades
                const atividades = yield this.atividadeRepo.obterTodos(0, 1000);
                const examples = [];
                for (const atividade of atividades) {
                    try {
                        const vendedor = yield this.vendedorRepo.obterPorId(atividade.vendedorId);
                        if (!vendedor)
                            continue;
                        const equipe = yield this.equipeRepo.obterPorId(vendedor.equipeId);
                        if (!equipe)
                            continue;
                        const meta = yield this.metaRepo.obterPorEquipe(equipe.id);
                        if (!meta)
                            continue;
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
                    }
                    catch (error) {
                        console.error(`Erro ao processar atividade ${atividade.id}:`, error);
                        continue;
                    }
                }
                return examples;
            }
            catch (error) {
                console.error('Erro ao preparar dados de treinamento:', error);
                throw error;
            }
        });
    }
    createModelInOllama(modelName, examples) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield this.fetchWithRetry(`${this.baseUrl}/create`, {
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
                    yield this.fetchWithRetry(`${this.baseUrl}/tune`, {
                        method: 'POST',
                        body: JSON.stringify(trainingData),
                        headers: { 'Content-Type': 'application/json' }
                    });
                    console.log(`Exemplo ${i + 1}/${examples.length} processado`);
                    yield this.delay(100); // Pequeno delay entre as chamadas
                }
            }
            catch (error) {
                console.error('Erro ao criar/treinar modelo no Ollama:', error);
                throw error;
            }
        });
    }
    trainModel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('\n🚀 Iniciando processo de treinamento do modelo...');
                console.log('===============================================');
                console.log('\n📊 Preparando dados de treinamento...');
                const examples = yield this.prepareTrainingData();
                console.log(`✅ Carregados ${examples.length} exemplos de treinamento`);
                console.log('\n🤖 Iniciando treinamento no Ollama...');
                yield this.createModelInOllama('nimage', examples);
                console.log('\n🎉 Treinamento concluído com sucesso!');
                console.log('===============================================');
                // Testar o modelo
                console.log('\n🧪 Testando o modelo com alguns exemplos:');
                for (let i = 0; i < 3 && i < examples.length; i++) {
                    console.log(`\n📝 Exemplo ${i + 1}:`);
                    console.log('Prompt:', examples[i].prompt);
                    const result = yield this.fetchWithRetry(`${this.baseUrl}/generate`, {
                        method: 'POST',
                        body: JSON.stringify({
                            model: 'nimage',
                            prompt: examples[i].prompt
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    });
                    console.log('Resposta:', result.response);
                    console.log('Real:', examples[i].completion);
                    yield this.delay(1000);
                }
            }
            catch (error) {
                console.error('\n❌ Erro durante o treinamento:', error);
                throw error;
            }
        });
    }
}
exports.OllamaTrainer = OllamaTrainer;
// Executar treinamento
const trainer = new OllamaTrainer();
trainer.trainModel().catch(console.error);
//# sourceMappingURL=ollamaTrainer.js.map