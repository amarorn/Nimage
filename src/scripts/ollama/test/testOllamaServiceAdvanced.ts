import { OllamaService } from '@/application/services/OllamaService';
import { MongoDB } from '@/infrastructure/database/MongoDB';

async function testOllamaServiceAdvanced() {
    try {
        console.log('🚀 Iniciando teste avançado do OllamaService...');
        
        // Conectar ao MongoDB
        const mongoDB = MongoDB.getInstance();
        await mongoDB.connect();
        
        // Inicializar o serviço
        const ollamaService = new OllamaService();
        
        // Dados de exemplo mais completos
        const vendorInfo = {
            resultado: {
                vendedor: {
                    nome: "João Silva",
                    feaVendedor: 20.39,
                    iapVendedor: 308470.91,
                    numeroDiasComAtividade: 112,
                    somaDocinhos: 486602,
                    mediaAtividadePorDia: 4344.66,
                    historicoVendas: [
                        { mes: "Janeiro", valor: 45000 },
                        { mes: "Fevereiro", valor: 48000 },
                        { mes: "Março", valor: 52000 },
                        { mes: "Abril", valor: 51000 },
                        { mes: "Maio", valor: 55000 },
                        { mes: "Junho", valor: 58000 }
                    ]
                },
                equipe: {
                    meta: 121250,
                    totalVendedores: 10,
                    mediaEquipe: 45000
                }
            }
        };

        console.log('\n📊 Dados de entrada:');
        console.log(JSON.stringify(vendorInfo, null, 2));

        // Obter insights
        console.log('\n🔍 Obtendo insights...');
        const insights = await ollamaService.getInsights(vendorInfo);

        console.log('\n📈 Resultados da análise:');
        console.log('----------------------------------------');
        console.log('1. Métricas Básicas:');
        console.log(`   - FEA: ${insights.resultado.vendedor.feaVendedor}`);
        console.log(`   - IAP: ${insights.resultado.vendedor.iapVendedor}`);
        console.log(`   - Dias Ativos: ${insights.resultado.vendedor.numeroDiasComAtividade}`);
        console.log(`   - Total Vendido: ${insights.resultado.vendedor.somaDocinhos}`);
        console.log(`   - Média Diária: ${insights.resultado.vendedor.mediaAtividadePorDia}`);

        console.log('\n2. Análise de Performance:');
        console.log(`   - Perfil: ${insights.resultado.vendedor.perfil_vendas}`);
        console.log(`   - Contribuição: ${insights.resultado.vendedor.percentual_contribuicao}%`);
        console.log(`   - Peso na Equipe: ${insights.resultado.vendedor.peso_vendedor}`);
        console.log(`   - Meta Individual: ${insights.resultado.vendedor.distribuicao_meta}`);
        console.log(`   - Desempenho Diário Ideal: ${insights.resultado.vendedor.desempenho_diario_ideal}`);

        console.log('\n3. Análise Temporal:');
        if (insights.resultado.vendedor.analise_avancada?.analiseTemporal) {
            console.log('   Padrões Semanais:', insights.resultado.vendedor.analise_avancada.analiseTemporal.padroesSemanais);
            console.log('   Sazonalidade:', insights.resultado.vendedor.analise_avancada.analiseTemporal.sazonalidade);
            console.log('   Tendências:', insights.resultado.vendedor.analise_avancada.analiseTemporal.tendencias);
        }

        console.log('\n4. Análise Comparativa:');
        if (insights.resultado.vendedor.analise_avancada?.analiseComparativa) {
            console.log('   Ranking:', insights.resultado.vendedor.analise_avancada.analiseComparativa.ranking);
            console.log('   Desempenho Relativo:', insights.resultado.vendedor.analise_avancada.analiseComparativa.desempenhoRelativo);
            console.log('   Benchmarking:', insights.resultado.vendedor.analise_avancada.analiseComparativa.benchmarking);
        }

        console.log('\n5. Previsões:');
        if (insights.resultado.vendedor.analise_avancada?.previsoes) {
            console.log('   Previsões Diárias:', insights.resultado.vendedor.analise_avancada.previsoes.diarias);
            console.log('   Cenários:', insights.resultado.vendedor.analise_avancada.previsoes.cenarios);
            console.log('   Fatores de Risco:', insights.resultado.vendedor.analise_avancada.previsoes.fatoresRisco);
        }

        console.log('\n6. Recomendações:');
        console.log('   Pontos Fortes:', insights.resultado.vendedor.pontos_fortes);
        console.log('   Pontos Fracos:', insights.resultado.vendedor.pontos_fracos);
        console.log('   Recomendações:', insights.resultado.vendedor.recomendacoes);
        console.log('   Estratégias:', insights.resultado.vendedor.estrategias_personalizadas);

        console.log('\n7. Projeções:');
        console.log(`   - Crescimento: ${insights.resultado.vendedor.projecao_crescimento}`);
        console.log(`   - Probabilidade: ${insights.resultado.vendedor.probabilidade_crescimento}`);
        console.log(`   - Nova Meta Sugerida: ${insights.resultado.vendedor.nova_meta_sugerida}`);

        console.log('\n8. Dados para Gráficos:');
        console.log('   Histórico:', insights.resultado.vendedor.dados_grafico.historico);
        console.log('   Previsão:', insights.resultado.vendedor.dados_grafico.previsao);

        console.log('\n✅ Teste concluído com sucesso!');
        console.log('----------------------------------------');

    } catch (error) {
        console.error('❌ Erro durante o teste:', error);
    }
}

// Executar o teste
testOllamaServiceAdvanced().catch(console.error); 