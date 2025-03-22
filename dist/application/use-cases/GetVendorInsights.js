"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVendorInsights = void 0;
const OllamaService_1 = require("../services/OllamaService");
const FormatterService_1 = require("../services/FormatterService");
class GetVendorInsights {
    constructor() {
        this.ollamaService = new OllamaService_1.OllamaService();
        this.formatterService = new FormatterService_1.FormatterService();
    }
    async execute(vendorInfo) {
        try {
            const insights = await this.ollamaService.getInsights(vendorInfo);
            console.log("🚀 ~ GetVendorInsights ~ execute ~ insights:", insights);
            if (insights && insights.resultado) {
                return this.formatterService.formatVendorData(insights);
            }
            throw new Error('No insights available');
        }
        catch (error) {
            console.error('Error executing GetVendorInsights use case:', error);
            throw error;
        }
    }
}
exports.GetVendorInsights = GetVendorInsights;
//# sourceMappingURL=GetVendorInsights.js.map