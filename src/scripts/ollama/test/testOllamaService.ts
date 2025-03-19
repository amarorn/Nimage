import { OllamaService } from '@/application/services/OllamaService';

async function testOllamaService() {
    try {
        console.log('🚀 Iniciando teste do OllamaService...');
        
        const ollamaService = new OllamaService();
        
        // Dados de exemplo
        const vendorInfo = {
            resultado: {
                vendedor: {
                    nome: "João Silva",
                    feaVendedor: 1.5,
                    iapVendedor: 2250,
                    numeroDiasComAtividade: 120,
                    somaDocinhos: 150000,
                    mediaAtividadePorDia: 1250,
                    historicoVendas: [
                        { mes: "Janeiro", valor: 37500 },
                        { mes: "Fevereiro", valor: 37500 },
                        { mes: "Março", valor: 37500 },
                        { mes: "Abril", valor: 37500 },
                        { mes: "Maio", valor: 37500 },
                        { mes: "Junho", valor: 37500 }
                    ]
                },
                equipe: {
                    meta: 100000
                }
            }
        };

        console.log('📊 Dados de entrada:', JSON.stringify(vendorInfo, null, 2));
        
        // Obtém insights
        const insights = await ollamaService.getInsights(vendorInfo);
        
        console.log('\n✅ Resultado da análise:');
        console.log('=========================');
        console.log('\n📈 Perfil de Vendas:', insights.resultado.vendedor.perfil_vendas);
        console.log('\n📊 Tendências:', insights.resultado.vendedor.tendencias);
        console.log('\n💪 Pontos Fortes:', insights.resultado.vendedor.pontos_fortes);
        console.log('\n⚠️ Pontos Fracos:', insights.resultado.vendedor.pontos_fracos);
        console.log('\n🎯 Recomendações:', insights.resultado.vendedor.recomendacoes);
        console.log('\n📈 Projeção de Crescimento:', insights.resultado.vendedor.projecao_crescimento);
        console.log('\n📊 Probabilidade de Crescimento:', insights.resultado.vendedor.probabilidade_crescimento);
        console.log('\n⚖️ Fator de Ajuste de Meta:', insights.resultado.vendedor.fator_ajuste_meta);
        console.log('\n🎯 Nova Meta Sugerida:', insights.resultado.vendedor.nova_meta_sugerida);
        
        console.log('\n📊 Dados para Gráficos:');
        console.log('Histórico:', insights.resultado.vendedor.dados_grafico.historico);
        console.log('Previsão:', insights.resultado.vendedor.dados_grafico.previsao);
        
        console.log('\n📈 Análise do Histórico:');
        console.log('Crescimento no Período:', insights.resultado.vendedor.analise_historico.crescimento_periodo);
        console.log('Tendências Identificadas:', insights.resultado.vendedor.analise_historico.tendencias_identificadas);
        console.log('Pontos de Melhoria:', insights.resultado.vendedor.analise_historico.pontos_melhoria);
        console.log('Estratégias Baseadas no Histórico:', insights.resultado.vendedor.analise_historico.estrategias_historico);
        
        console.log('\n🎉 Teste concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante o teste:', error);
    }
}

testOllamaService().catch(console.error); 