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
exports.OllamaService = void 0;
const ollama_1 = require("ollama");
class OllamaService {
    constructor() {
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11500/api/generate';
    }
    checkHealth() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ollama = new ollama_1.Ollama({ host: this.baseUrl });
                const response = yield ollama.generate({
                    model: 'nimage_gerente',
                    prompt: 'ola gerente, como vai?',
                    stream: false,
                });
                // Log the response to understand its structure
                console.log(response);
                // Adjust this based on the actual structure of GenerateResponse
                if (response.done === true) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error('Erro ao verificar a saúde do serviço Ollama:', error);
                return false;
            }
        });
    }
}
exports.OllamaService = OllamaService;
