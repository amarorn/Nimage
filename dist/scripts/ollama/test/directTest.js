"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
async function testOllama() {
    try {
        console.log('Iniciando teste direto do Ollama...');
        const response = await (0, node_fetch_1.default)('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'nimage',
                prompt: `Analise o desempenho do vendedor João Silva com base nos seguintes dados:

Métricas:
- FEA: 1.5
- IAP: 2500
- Dias Ativos: 30
- Total Vendido: 1000
- Média Diária: 33.33`,
                stream: false
            })
        });
        const result = await response.json();
        console.log('Resposta:', JSON.stringify(result, null, 2));
    }
    catch (error) {
        console.error('Erro:', error);
    }
}
testOllama().catch(console.error);
//# sourceMappingURL=directTest.js.map