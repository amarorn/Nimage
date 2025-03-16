import { Router, Request, Response } from 'express';
import { GetVendorInsights } from '../../application/use-cases/GetVendorInsights';
import { AtividadeService } from '../../application/services/AtividadeService';
import { AtividadeRepositoryImpl } from '../../infrastructure/repositories/AtividadeRepositoryImpl';
import { FrequenciaVendasService } from '../../application/services/FrequenciaVendasService';
import { ObterEquipeDadosFull } from '../../application/use-cases/ObterEquipeDadosFull';
import { EquipeRepositoryImpl } from '../../infrastructure/repositories/EquipeRepositoryImpl';
import { VendedorRepositoryImpl } from '../../infrastructure/repositories/VendedorRepositoryImpl';
import { MetaRepositoryImpl } from '../../infrastructure/repositories/MetaRepositoryImpl';

const router = Router();
const getVendorInsights = new GetVendorInsights();
const atividadeRepo = new AtividadeRepositoryImpl();
const atividadeService = new AtividadeService(atividadeRepo);
const equipeRepo = new EquipeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl();
const metaRepo = new MetaRepositoryImpl();
const obterEquipeDadosFull = new ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
const frequenciaVendasService = new FrequenciaVendasService(obterEquipeDadosFull);

// Rota para insights de um vendedor específico
router.get('/vendor-insights/:vendedorId', async (req: Request, res: Response) => {
    try {
        const { vendedorId } = req.params;
        
        // Busca dados do vendedor
        const vendedor = await vendedorRepo.obterPorId(vendedorId);
        if (!vendedor) {
            return res.status(404).json({ error: 'Vendedor não encontrado' });
        }

        // Busca dados da equipe
        const equipe = await equipeRepo.obterPorId(vendedor.equipe_id);
        if (!equipe) {
            return res.status(404).json({ error: 'Equipe não encontrada' });
        }

        // Busca meta da equipe
        const meta = await metaRepo.obterPorEquipe(equipe.id);

        // Calcula datas para análise (últimos 6 meses)
        const hoje = new Date();
        const dataFim = hoje;
        const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 6, hoje.getDate());

        // Busca atividades do vendedor
        const atividades = await atividadeRepo.obterPorVendedorEData(vendedorId, dataInicio, dataFim);
        
        // Calcula métricas
        const diasComAtividade = atividades.length;
        const totalDocinhos = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
        const mediaPorDia = diasComAtividade > 0 ? totalDocinhos / diasComAtividade : 0;

        // Calcula FEA e IAP
        const frequencia = await frequenciaVendasService.calcularFrequencia(equipe.id, dataInicio, dataFim);
        const fea = await atividadeService.calcularFEA(equipe.id, frequencia.totalDiasDisponiveis, frequencia.diasComAtividade);
        const iap = mediaPorDia * (frequencia.totalDiasDisponiveis - diasComAtividade);

        // Prepara dados para análise
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
                    meta: meta?.objetivo || 0
                }
            }
        };

        // Gera insights
        const insights = await getVendorInsights.execute(vendorInfo);
        res.status(200).json(insights);
    } catch (error) {
        console.error('Erro ao gerar insights:', error);
        res.status(500).json({ 
            error: 'Erro ao gerar insights do vendedor', 
            details: (error as Error).message 
        });
    }
});

// Nova rota para insights de todos os vendedores
router.get('/vendor-insights', async (req: Request, res: Response) => {
    try {
        // Busca todos os vendedores (limitando a 1000 para evitar sobrecarga)
        const vendedores = await vendedorRepo.obterTodos(0, 1000);
        
        // Calcula datas para análise (últimos 6 meses)
        const hoje = new Date();
        const dataFim = hoje;
        const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 6, hoje.getDate());

        // Array para armazenar insights de todos os vendedores
        const insightsPromises = vendedores.map(async (vendedor) => {
            try {
                // Busca dados da equipe
                const equipe = await equipeRepo.obterPorId(vendedor.equipe_id);
                if (!equipe) return null;

                // Busca meta da equipe
                const meta = await metaRepo.obterPorEquipe(equipe.id);

                // Busca atividades do vendedor
                const atividades = await atividadeRepo.obterPorVendedorEData(vendedor.id, dataInicio, dataFim);
                
                // Calcula métricas
                const diasComAtividade = atividades.length;
                const totalDocinhos = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
                const mediaPorDia = diasComAtividade > 0 ? totalDocinhos / diasComAtividade : 0;

                // Calcula FEA e IAP
                const frequencia = await frequenciaVendasService.calcularFrequencia(equipe.id, dataInicio, dataFim);
                const fea = await atividadeService.calcularFEA(equipe.id, frequencia.totalDiasDisponiveis, frequencia.diasComAtividade);
                const iap = mediaPorDia * (frequencia.totalDiasDisponiveis - diasComAtividade);

                // Prepara dados para análise
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
                            meta: meta?.objetivo || 0
                        }
                    }
                };

                // Gera insights
                const insights = await getVendorInsights.execute(vendorInfo);
                return insights;
            } catch (error) {
                console.error(`Erro ao gerar insights para o vendedor ${vendedor.nome}:`, error);
                return null;
            }
        });

        // Aguarda todos os insights serem gerados
        const insights = await Promise.all(insightsPromises);
        
        // Filtra insights nulos e retorna o resultado
        const insightsValidos = insights.filter(insight => insight !== null);
        
        res.status(200).json({
            totalVendedores: insightsValidos.length,
            insights: insightsValidos
        });
    } catch (error) {
        console.error('Erro ao gerar insights de todos os vendedores:', error);
        res.status(500).json({ 
            error: 'Erro ao gerar insights dos vendedores', 
            details: (error as Error).message 
        });
    }
});

export default router;