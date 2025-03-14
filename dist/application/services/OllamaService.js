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
exports.OllamaService = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class OllamaService {
    constructor() {
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11500/api';
    }
    getInsights(vendorInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            try {
                if (!vendorInfo || !vendorInfo.resultado) {
                    throw new Error('Invalid vendorInfo structure');
                }
                for (const vendedor of vendorInfo.resultado.frequenciaPorVendedor) {
                    const improvementPrompt = `Sugestões de melhoria para ${vendedor.vendedorNome} com base em FEA: ${vendedor.feaVendedor}, IAP: ${vendedor.iapVendedor}, Perfil: ${this.determineProfile(vendedor)}.`;
                    const response = yield (0, node_fetch_1.default)(`${this.baseUrl}/generate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: 'nimage',
                            prompt: `Os seguintes dados representam o desempenho de uma equipe de vendas: ${improvementPrompt}`,
                            input_data: {
                                meta: vendorInfo.resultado.meta,
                                vendedor: vendedor
                            },
                            stream: false,
                        }),
                    });
                    const result = yield response.json();
                    results.push(result);
                }
                return results;
            }
            catch (error) {
                console.error('Error fetching insights from Ollama:', error);
                throw error;
            }
        });
    }
    determinePositioning(vendedor) {
        // Implement the logic to determine the positioning of the vendedor
        // This is a placeholder and should be replaced with the actual implementation
        return 'Top Performer';
    }
    determineProfile(vendedor) {
        // Implement the logic to determine the profile of the vendedor
        // This is a placeholder and should be replaced with the actual implementation
        return 'Senior';
    }
}
exports.OllamaService = OllamaService;
