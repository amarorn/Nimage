import { OllamaService } from '../../../application/services/OllamaService';

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
                    vendasMesAnterior: "12000",
                    mediaEquipeMesAnterior: "10000",
                    totalVendedores: 5,
                    totalVendasEquipeMesAnterior: "50000",
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
                    meta: "60000",
                    meta_anterior: "50000",
                    periodoMetaAnterior: "Janeiro/2024"
                }
            }
        };

        console.log('📊 Dados de entrada:', JSON.stringify(vendorInfo, null, 2));
        
        // Obtém insights
        const insights = await ollamaService.getInsights(vendorInfo);
        
        console.log('\n✅ Resultado da análise:');
        console.log('=========================');
        
        const vendedor = insights.resultado.vendedor;
        
        // Informações do Vendedor
        console.log('\n👤 Informações do Vendedor:');
        console.log('---------------------------');
        console.log(`Nome: ${vendedor.nome}`);
        console.log(`FEA: ${vendedor.feaVendedor}`);
        console.log(`IAP: ${vendedor.iapVendedor}`);
        console.log(`Dias com Atividade: ${vendedor.numeroDiasComAtividade}`);
        console.log(`Total de Docinhos: ${vendedor.somaDocinhos.toLocaleString('pt-BR')}`);
        console.log(`Média por Dia: ${vendedor.mediaAtividadePorDia.toLocaleString('pt-BR')}`);
        
        // Métricas de Performance
        console.log('\n📈 Métricas de Performance:');
        console.log('---------------------------');
        console.log(`Percentual de Contribuição: ${vendedor.percentual_contribuicao?.toFixed(2)}%`);
        console.log(`Percentual de Crescimento: ${vendedor.percentualCrescimento}%`);
        console.log(`Peso na Equipe: ${(vendedor.peso_vendedor * 100)?.toFixed(2)}%`);
        console.log(`Distribuição da Meta: ${vendedor.distribuicao_meta?.toLocaleString('pt-BR')}`);
        console.log(`Desempenho Diário Ideal: ${vendedor.desempenho_diario_ideal?.toLocaleString('pt-BR')}`);
        
        // Análise Qualitativa
        console.log('\n🎯 Análise Qualitativa:');
        console.log('----------------------');
        console.log('📈 Perfil de Vendas:', vendedor.perfil_vendas || 'Não disponível');
        console.log('\n📊 Tendências:', vendedor.tendencias?.join('\n- ') || 'Não disponível');
        console.log('\n💪 Pontos Fortes:', vendedor.pontos_fortes?.join('\n- ') || 'Não disponível');
        console.log('\n⚠️ Pontos Fracos:', vendedor.pontos_fracos?.join('\n- ') || 'Não disponível');
        console.log('\n🎯 Recomendações:', vendedor.recomendacoes?.join('\n- ') || 'Não disponível');
        
        // Projeções e Metas
        console.log('\n🎯 Projeções e Metas:');
        console.log('--------------------');
        console.log('📈 Projeção de Crescimento:', vendedor.projecao_crescimento || 'Não disponível');
        console.log('📊 Probabilidade de Crescimento:', vendedor.probabilidade_crescimento || 'Não disponível');
        console.log('⚖️ Fator de Ajuste de Meta:', vendedor.fator_ajuste_meta || 'Não disponível');
        console.log('🎯 Nova Meta Sugerida:', vendedor.nova_meta_sugerida?.toLocaleString('pt-BR') || 'Não disponível');
        
        // Dados para Gráficos
        console.log('\n📊 Dados para Gráficos:');
        console.log('---------------------');
        console.log('Histórico:');
        if (vendedor.dados_grafico?.historico?.length > 0) {
            vendedor.dados_grafico.historico.forEach((item: { mes: string; valor: number }) => {
                console.log(`${item.mes}: ${item.valor.toLocaleString('pt-BR')}`);
            });
        } else {
            console.log('Não disponível');
        }
        
        console.log('\nPrevisão:');
        if (vendedor.dados_grafico?.previsao?.length > 0) {
            vendedor.dados_grafico.previsao.forEach((item: { mes: string; valor: number }) => {
                console.log(`${item.mes}: ${item.valor.toLocaleString('pt-BR')}`);
            });
        } else {
            console.log('Não disponível');
        }
        
        // Análise do Histórico
        if (vendedor.analise_historico) {
            console.log('\n📈 Análise do Histórico:');
            console.log('----------------------');
            console.log('Crescimento no Período:', vendedor.analise_historico.crescimento_periodo || 'Não disponível');
            console.log('\nTendências Identificadas:');
            if (vendedor.analise_historico.tendencias_identificadas?.length > 0) {
                console.log(vendedor.analise_historico.tendencias_identificadas.join('\n- '));
            } else {
                console.log('Não disponível');
            }
            
            console.log('\nPontos de Melhoria:');
            if (vendedor.analise_historico.pontos_melhoria?.length > 0) {
                console.log(vendedor.analise_historico.pontos_melhoria.join('\n- '));
            } else {
                console.log('Não disponível');
            }
            
            console.log('\nEstratégias Baseadas no Histórico:');
            if (vendedor.analise_historico.estrategias_historico?.length > 0) {
                console.log(vendedor.analise_historico.estrategias_historico.join('\n- '));
            } else {
                console.log('Não disponível');
            }
        }
        
        console.log('\n🎉 Teste concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante o teste:', error);
    }
}

testOllamaService().catch(console.error); 