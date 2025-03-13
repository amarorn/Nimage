import fetch from 'node-fetch';

export class OllamaService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11500/api';
    }

    async getInsights(vendorInfo: any): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'meu-modelo',
                    prompt: 'Os seguintes dados representam o desempenho de uma equipe de vendas:',
                    input_data: vendorInfo,
                    stream: false,
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching insights from Ollama:', error);
            throw error;
        }
    }
} 