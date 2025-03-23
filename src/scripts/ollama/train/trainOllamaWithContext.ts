import { MongoDB } from '@/infrastructure/database/MongoDB';
import { AtividadeRepositoryImpl } from '@/infrastructure/repositories/AtividadeRepositoryImpl';
import { VendedorRepositoryImpl } from '@/infrastructure/repositories/VendedorRepositoryImpl';
import { EquipeRepositoryImpl } from '@/infrastructure/repositories/EquipeRepositoryImpl';
import { MetaRepositoryImpl } from '@/infrastructure/repositories/MetaRepositoryImpl';
import { FrequenciaVendasService } from '@/application/services/FrequenciaVendasService';
import { ObterEquipeDadosFull } from '@/application/use-cases/ObterEquipeDadosFull';
import { AtividadeService } from '@/application/services/AtividadeService';
import { OllamaService } from '@/application/services/OllamaService';
import fs from 'fs';
import path from 'path';

async function trainModel() {
    try {
        console.log('🚀 Iniciando processo de treinamento do modelo...');
        
        // Conectar ao MongoDB
        await MongoDB.conectar();
        
        // Inicializar repositórios
        const atividadeRepo = new AtividadeRepositoryImpl();
        const vendedorRepo = new VendedorRepositoryImpl();
        const equipeRepo = new EquipeRepositoryImpl();
        const metaRepo = new MetaRepositoryImpl();
        
        // Inicializar serviços
        const obterEquipeDadosFull = new ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
        const frequenciaVendasService = new FrequenciaVendasService(obterEquipeDadosFull);
        const atividadeService = new AtividadeService(atividadeRepo, vendedorRepo, equipeRepo, metaRepo);
        const ollamaService = new OllamaService();

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

                // Preparar dados para análise
                const vendorInfo = {
                    resultado: {
                        vendedor: {
                            nome: vendedor.nome,
                            feaVendedor: fea,
                            iapVendedor: iap,
                            numeroDiasComAtividade: diasComAtividade,
                            somaDocinhos: totalDocinhos,
                            mediaAtividadePorDia: mediaPorDia
                        },
                        equipe: {
                            meta: meta.objetivo
                        }
                    }
                };

                // Gerar insights
                const insights = await ollamaService.getInsights(vendorInfo);
                
                // Treinar o modelo com os insights
                const prompt = `
Analise o desempenho do vendedor ${vendedor.nome} com base nos seguintes dados:
FEA: ${fea.toFixed(2)}
IAP: ${iap.toFixed(2)}
Dias com Atividade: ${diasComAtividade}
Total de Docinhos: ${totalDocinhos}
Média por Dia: ${mediaPorDia.toFixed(2)}
Meta da Equipe: ${meta.objetivo}`;

                const completion = JSON.stringify(insights);
                
                // Treinar o modelo
                await ollamaService.trainModel({ prompt, completion });
                
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

trainModel().catch(console.error); 