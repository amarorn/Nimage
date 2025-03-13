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
exports.GetVendorInsights = void 0;
const OllamaService_1 = require("../services/OllamaService");
class GetVendorInsights {
    constructor() {
        this.ollamaService = new OllamaService_1.OllamaService();
    }
    execute(equipeData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const insights = yield this.ollamaService.getInsights(equipeData);
                return insights;
            }
            catch (error) {
                console.error('Error executing GetVendorInsights use case:', error);
                throw error;
            }
        });
    }
}
exports.GetVendorInsights = GetVendorInsights;
