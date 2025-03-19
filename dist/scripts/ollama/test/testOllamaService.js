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
Object.defineProperty(exports, "__esModule", { value: true });
const OllamaService_1 = require("../../../application/services/OllamaService");
function testOllamaService() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const insights = yield ollamaService.getInsights(vendorInfo);
            console.log('Análise concluída:', JSON.stringify(insights, null, 2));
        }
        catch (error) {
            console.error('Erro ao testar OllamaService:', error);
        }
    });
}
testOllamaService();
//# sourceMappingURL=testOllamaService.js.map