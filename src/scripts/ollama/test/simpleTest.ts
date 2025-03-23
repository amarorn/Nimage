import { OllamaService } from '../../../application/services/OllamaService';

const ollamaService = new OllamaService();

const vendorInfo = {
    resultado: {
        vendedor: {
            nome: "João Silva",
            feaVendedor: 1.5,
            iapVendedor: 2500,
            numeroDiasComAtividade: 30,
            somaDocinhos: 1000,
            mediaAtividadePorDia: 33.33,
            vendasMesAnterior: "1000",
            mediaEquipeMesAnterior: "800",
            totalVendedores: 5,
            totalVendasEquipeMesAnterior: "4000",
            historicoVendas: [
                { mes: "Janeiro", dia: 1, valor: 100 },
                { mes: "Janeiro", dia: 2, valor: 150 },
                { mes: "Janeiro", dia: 3, valor: 200 }
            ],
            periodoAnalise: "Janeiro 2024"
        },
        equipe: {
            meta: "5000",
            meta_anterior: "4000",
            periodoMetaAnterior: "Dezembro 2023"
        }
    }
};

ollamaService.getInsights(vendorInfo)
    .then(insights => {
        console.log('Insights:', JSON.stringify(insights, null, 2));
    })
    .catch(error => {
        console.error('Erro:', error);
    }); 