import { OllamaService } from '../services/OllamaService';
import { FormatterService } from '../services/FormatterService';

export class GetVendorInsights {
    private ollamaService: OllamaService;
    private formatterService: FormatterService;

    constructor() {
        this.ollamaService = new OllamaService();
        this.formatterService = new FormatterService();
    }

    async execute(vendorInfo: any): Promise<any> {
        try {
            const insights = await this.ollamaService.getInsights(vendorInfo);
            console.log("🚀 ~ GetVendorInsights ~ execute ~ insights:", insights)
            
            if (insights && insights.resultado) {
                return this.formatterService.formatVendorData(insights);
            }
            
            throw new Error('No insights available');
        } catch (error) {
            console.error('Error executing GetVendorInsights use case:', error);
            throw error;
        }
    }
} 