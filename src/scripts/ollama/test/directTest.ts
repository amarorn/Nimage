import fetch from 'node-fetch';

async function testOllama() {
    try {
        console.log('Iniciando teste direto do Ollama...');
        
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'nimage',
                prompt: `Analise o desempenho do vendedor João Silva com base nos seguintes dados:

Métricas:
- FEA: 1.5
- IAP: 2500
- Dias Ativos: 30
- Total Vendido: 1000
- Média Diária: 33.33`,
                stream: false
            })
        });

        const result = await response.json();
        console.log('Resposta:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Erro:', error);
    }
}

testOllama().catch(console.error); 