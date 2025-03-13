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
exports.OllamaUseCase = void 0;
const OllamaService_1 = require("../../infrastructure/OllamaService");
class OllamaUseCase {
    constructor() {
        this.ollamaService = new OllamaService_1.OllamaService();
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const isHealthy = yield this.ollamaService.checkHealth();
            if (isHealthy) {
                console.log('Ollama service is healthy');
            }
            else {
                console.error('Ollama service is not healthy');
            }
        });
    }
}
exports.OllamaUseCase = OllamaUseCase;
