"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OllamaService_1 = require("../../../application/services/OllamaService");
async function testOllamaService() {
    try {
        const ollamaService = new OllamaService_1.OllamaService();
        const vendorInfo = {
            resultado: {
                vendedor: {
                    nome: "João Silva",
                    feaVendedor: 1.5,
                    iapVendedor: 25000,
                    numeroDiasComAtividade: 30,
                    somaDocinhos: 15000,
                    mediaAtividadePorDia: 500,
                    vendasMesAnterior: "12000",
                    mediaEquipeMesAnterior: "10000",
                    totalVendedores: 5,
                    totalVendasEquipeMesAnterior: "50000",
                    historicoVendas: [
                        { mes: "Janeiro", dia: 1, valor: 450 },
                        { mes: "Janeiro", dia: 2, valor: 520 },
                        { mes: "Janeiro", dia: 3, valor: 480 }
                    ]
                },
                equipe: {
                    meta: "60000",
                    meta_anterior: "50000",
                    periodoMetaAnterior: "Janeiro/2024"
                }
            }
        };
        console.log('Iniciando análise do vendedor...');
        const insights = await ollamaService.getInsights(vendorInfo);
        console.log('Análise concluída:', JSON.stringify(insights, null, 2));
    }
    catch (error) {
        console.error('Erro ao testar OllamaService:', error);
    }
}
testOllamaService();
//# sourceMappingURL=testOllamaService.js.map