import fetch from 'node-fetch';

export class OllamaService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11500/api';
    }

    async getInsights(vendorInfo: any): Promise<any> {
        const results = [];
        try {
            // Iterar sobre cada vendedor
            for (const vendedor of vendorInfo.resultado.frequenciaPorVendedor) {
                const response = await fetch(`${this.baseUrl}/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'nimage',
                        prompt: 'Os seguintes dados representam o desempenho de uma equipe de vendas:',
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
} 