import fetch from 'node-fetch';

export class OllamaService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11500/api';
    }

    async getInsights(vendorInfo: any): Promise<any> {
        const results = [];
        try {
            if (!vendorInfo || !vendorInfo.resultado) {
                throw new Error('Invalid vendorInfo structure');
            }
            for (const vendedor of vendorInfo.resultado.frequenciaPorVendedor) {
                const improvementPrompt = `Sugestões de melhoria para ${vendedor.vendedorNome} com base em FEA: ${vendedor.feaVendedor}, IAP: ${vendedor.iapVendedor}, Perfil: ${this.determineProfile(vendedor)}.`;
                const response = await fetch(`${this.baseUrl}/generate`, {
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
                const result = await response.json();
                results.push(result);
            }
            return results;
        } catch (error) {
            console.error('Error fetching insights from Ollama:', error);
            throw error;
        }
    }

    private determinePositioning(vendedor: any): string {
        // Implement the logic to determine the positioning of the vendedor
        // This is a placeholder and should be replaced with the actual implementation
        return 'Top Performer';
    }

    private determineProfile(vendedor: any): string {
        // Implement the logic to determine the profile of the vendedor
        // This is a placeholder and should be replaced with the actual implementation
        return 'Senior';
    }
} 