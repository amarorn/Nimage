import { OllamaService } from '../services/OllamaService';
import { FormatterService } from '../services/FormatterService';

export class GetVendorInsights {
    private ollamaService: OllamaService;
    private formatterService: FormatterService;

    constructor() {
        this.ollamaService = new OllamaService();
        this.formatterService = new FormatterService();
    }

    async execute(equipeData: any, dataInicio: Date, dataFim: Date): Promise<any> {
        try {
            const insights = await this.ollamaService.getInsights(equipeData);
            console.log("🚀 ~ GetVendorInsights ~ execute ~ insights:", insights)
            
            const formattedInsights = insights.map((insight: any, index: number) => {
                const vendorData = equipeData.resultado.frequenciaPorVendedor[index];
                return this.formatterService.formatVendorData({
                    resultado: {
                        equipe: equipeData.resultado.equipe,
                        meta: equipeData.resultado.meta,
                        frequenciaPorVendedor: [vendorData]
                    }
                });
            });
            return formattedInsights;
        } catch (error) {
            console.error('Error executing GetVendorInsights use case:', error);
            throw error;
        }
    }
} 