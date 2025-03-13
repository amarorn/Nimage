import { OllamaService } from '../services/OllamaService';

export class GetVendorInsights {
    private ollamaService: OllamaService;

    constructor() {
        this.ollamaService = new OllamaService();
    }

    async execute(equipeData: any): Promise<any> {
        try {
            const insights = await this.ollamaService.getInsights(equipeData);
            return insights;
        } catch (error) {
            console.error('Error executing GetVendorInsights use case:', error);
            throw error;
        }
    }
} 