import { MongoDB } from '../infrastructure/database/MongoDB';
import { AtividadeRepositoryImpl } from '../infrastructure/repositories/AtividadeRepositoryImpl';
import { VendedorRepositoryImpl } from '../infrastructure/repositories/VendedorRepositoryImpl';
import { EquipeRepositoryImpl } from '../infrastructure/repositories/EquipeRepositoryImpl';
import { MetaRepositoryImpl } from '../infrastructure/repositories/MetaRepositoryImpl';
import { FrequenciaVendasService } from '../application/services/FrequenciaVendasService';
import { ObterEquipeDadosFull } from '../application/use-cases/ObterEquipeDadosFull';
import { AtividadeService } from '../application/services/AtividadeService';
import fetch from 'node-fetch';

async function trainSimpleModel() {
    try {
        console.log('🚀 Iniciando treinamento do modelo...');
        
        // Conectar ao MongoDB
        const mongoDB = MongoDB.getInstance();
        await mongoDB.connect();
        
        // Inicializar repositórios
        const atividadeRepo = new AtividadeRepositoryImpl();
        const vendedorRepo = new VendedorRepositoryImpl();
        const equipeRepo = new EquipeRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl();
        
        // Inicializar serviços
        const obterEquipeDadosFull = new ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
        const frequenciaVendasService = new FrequenciaVendasService(obterEquipeDadosFull);
        const atividadeService = new AtividadeService(atividadeRepo, vendedorRepo, equipeRepo, metaRepo);

        // Buscar todos os vendedores
        const vendedores = await vendedorRepo.obterTodos(0, 1000);
        console.log(`📊 Encontrados ${vendedores.length} vendedores para processar`);

        // Processar cada vendedor
        for (const vendedor of vendedores) {
            try {
                // Buscar dados da equipe
                const equipe = await equipeRepo.obterPorId(vendedor.equipeId);
                if (!equipe) continue;

                // Buscar meta da equipe
                const meta = await metaRepo.obterPorEquipe(equipe.id);
                if (!meta) continue;

                // Calcular datas para análise (últimos 6 meses)
                const hoje = new Date();
                const dataFim = hoje;
                const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 6, hoje.getDate());

                // Buscar atividades do vendedor
                const atividades = await atividadeRepo.obterPorVendedorEData(vendedor.id, dataInicio, dataFim);
                
                // Calcular métricas
                const diasComAtividade = atividades.length;
                const totalDocinhos = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
                const mediaPorDia = diasComAtividade > 0 ? totalDocinhos / diasComAtividade : 0;

                // Calcular FEA e IAP
                const frequencia = await frequenciaVendasService.calcularFrequencia(equipe.id, dataInicio, dataFim);
                const fea = await atividadeService.calcularFEA(equipe.id, frequencia.totalDiasDisponiveis, frequencia.diasComAtividade);
                const iap = mediaPorDia * (frequencia.totalDiasDisponiveis - diasComAtividade);

                // Preparar prompt para treinamento
                const prompt = `
Analise o desempenho do vendedor ${vendedor.nome} com base nos seguintes dados:
FEA: ${fea.toFixed(2)}
IAP: ${iap.toFixed(2)}
Dias com Atividade: ${diasComAtividade}
Total de Docinhos: ${totalDocinhos}
Média por Dia: ${mediaPorDia.toFixed(2)}
Meta da Equipe: ${meta.objetivo}`;

                // Preparar resposta estruturada
                const completion = {
                    perfil_vendas: `${diasComAtividade > 100 ? 'Vendedor experiente com excelente performance' : diasComAtividade > 50 ? 'Vendedor intermediário com boa performance' : 'Vendedor iniciante com potencial de crescimento'}`,
                    tendencias: [
                        `${mediaPorDia > 150 ? 'Tendência de crescimento acelerado' : mediaPorDia > 100 ? 'Tendência de crescimento estável' : 'Tendência de desenvolvimento gradual'}`,
                        `${fea > 1.5 ? 'Alta eficiência operacional' : fea > 1.0 ? 'Boa eficiência operacional' : 'Eficiência em desenvolvimento'}`
                    ],
                    pontos_fortes: [
                        `${mediaPorDia > 150 ? 'Alta produtividade diária' : mediaPorDia > 100 ? 'Boa produtividade diária' : 'Consistência nas atividades'}`,
                        `${fea > 1.5 ? 'Excelente eficiência operacional' : fea > 1.0 ? 'Boa eficiência operacional' : 'Dedicação nas atividades'}`
                    ],
                    pontos_fracos: [
                        `${mediaPorDia < 100 ? 'Baixa produtividade diária' : mediaPorDia < 150 ? 'Produtividade pode melhorar' : 'Possível sobrecarga de trabalho'}`,
                        `${fea < 1.0 ? 'Baixa eficiência operacional' : fea < 1.5 ? 'Eficiência pode melhorar' : 'Possível necessidade de mais desafios'}`
                    ],
                    recomendacoes: [
                        `${mediaPorDia < 100 ? 'Focar em aumentar a produtividade diária' : mediaPorDia < 150 ? 'Manter a produtividade e buscar melhorias' : 'Compartilhar boas práticas com a equipe'}`,
                        `${fea < 1.0 ? 'Melhorar a eficiência operacional' : fea < 1.5 ? 'Manter a eficiência e buscar melhorias' : 'Mentorar outros vendedores'}`
                    ],
                    projecao_crescimento: `${mediaPorDia > 150 ? 'Alto potencial de crescimento' : mediaPorDia > 100 ? 'Bom potencial de crescimento' : 'Potencial de crescimento moderado'}`,
                    estrategias_personalizadas: [
                        `${mediaPorDia < 100 ? 'Desenvolver plano de ação focado em aumento de produtividade' : mediaPorDia < 150 ? 'Implementar rotina de melhorias de produtividade' : 'Otimizar processos existentes'}`,
                        `${fea < 1.0 ? 'Focar em melhorias de eficiência operacional' : fea < 1.5 ? 'Manter e replicar boas práticas' : 'Compartilhar conhecimento com a equipe'}`
                    ],
                    nova_meta_sugerida: Math.round(meta.objetivo * (1 + fea * 0.1)),
                    probabilidade_crescimento: `${mediaPorDia > 150 ? '30% a 40%' : mediaPorDia > 100 ? '20% a 30%' : '10% a 20%'}`,
                    fator_ajuste_meta: (mediaPorDia / 150).toFixed(4),
                    dados_grafico: {
                        historico: Array(6).fill(null).map((_, i) => ({
                            mes: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'][i],
                            valor: mediaPorDia * 30
                        })),
                        previsao: Array(3).fill(null).map((_, i) => ({
                            mes: ['Julho', 'Agosto', 'Setembro'][i],
                            valor: mediaPorDia * 30 * (1 + fea * 0.1)
                        }))
                    }
                };

                // Treinar o modelo
                const response = await fetch('http://localhost:11434/api/tune', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'nimage',
                        prompt,
                        response: JSON.stringify(completion)
                    })
                });

                if (!response.ok) {
                    throw new Error(`Erro ao treinar modelo: ${response.statusText}`);
                }

                console.log(`✅ Treinamento concluído para o vendedor ${vendedor.nome}`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Delay para evitar sobrecarga

            } catch (error) {
                console.error(`❌ Erro ao processar vendedor ${vendedor.nome}:`, error);
            }
        }

        console.log('🎉 Treinamento concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante o treinamento:', error);
    }
}

trainSimpleModel().catch(console.error); 