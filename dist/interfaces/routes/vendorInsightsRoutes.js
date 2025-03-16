"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GetVendorInsights_1 = require("../../application/use-cases/GetVendorInsights");
const AtividadeService_1 = require("../../application/services/AtividadeService");
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const FrequenciaVendasService_1 = require("../../application/services/FrequenciaVendasService");
const ObterEquipeDadosFull_1 = require("../../application/use-cases/ObterEquipeDadosFull");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const router = (0, express_1.Router)();
const getVendorInsights = new GetVendorInsights_1.GetVendorInsights();
const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
const atividadeService = new AtividadeService_1.AtividadeService(atividadeRepo);
const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
const obterEquipeDadosFull = new ObterEquipeDadosFull_1.ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
const frequenciaVendasService = new FrequenciaVendasService_1.FrequenciaVendasService(obterEquipeDadosFull);
// Rota para insights de um vendedor específico
router.get('/vendor-insights/:vendedorId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vendedorId } = req.params;
        // Busca dados do vendedor
        const vendedor = yield vendedorRepo.obterPorId(vendedorId);
        if (!vendedor) {
            return res.status(404).json({ error: 'Vendedor não encontrado' });
        }
        // Busca dados da equipe
        const equipe = yield equipeRepo.obterPorId(vendedor.equipe_id);
        if (!equipe) {
            return res.status(404).json({ error: 'Equipe não encontrada' });
        }
        // Busca meta da equipe
        const meta = yield metaRepo.obterPorEquipe(equipe.id);
        // Calcula datas para análise (últimos 6 meses)
        const hoje = new Date();
        const dataFim = hoje;
        const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 6, hoje.getDate());
        // Busca atividades do vendedor
        const atividades = yield atividadeRepo.obterPorVendedorEData(vendedorId, dataInicio, dataFim);
        // Calcula métricas
        const diasComAtividade = atividades.length;
        const totalDocinhos = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
        const mediaPorDia = diasComAtividade > 0 ? totalDocinhos / diasComAtividade : 0;
        // Calcula FEA e IAP
        const frequencia = yield frequenciaVendasService.calcularFrequencia(equipe.id, dataInicio, dataFim);
        const fea = yield atividadeService.calcularFEA(equipe.id, frequencia.totalDiasDisponiveis, frequencia.diasComAtividade);
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
                    meta: (meta === null || meta === void 0 ? void 0 : meta.objetivo) || 0
                }
            }
        };
        // Gera insights
        const insights = yield getVendorInsights.execute(vendorInfo);
        res.status(200).json(insights);
    }
    catch (error) {
        console.error('Erro ao gerar insights:', error);
        res.status(500).json({
            error: 'Erro ao gerar insights do vendedor',
            details: error.message
        });
    }
}));
// Nova rota para insights de todos os vendedores
router.get('/vendor-insights', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Busca todos os vendedores (limitando a 1000 para evitar sobrecarga)
        const vendedores = yield vendedorRepo.obterTodos(0, 1000);
        // Calcula datas para análise (últimos 6 meses)
        const hoje = new Date();
        const dataFim = hoje;
        const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 6, hoje.getDate());
        // Array para armazenar insights de todos os vendedores
        const insightsPromises = vendedores.map((vendedor) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Busca dados da equipe
                const equipe = yield equipeRepo.obterPorId(vendedor.equipe_id);
                if (!equipe)
                    return null;
                // Busca meta da equipe
                const meta = yield metaRepo.obterPorEquipe(equipe.id);
                // Busca atividades do vendedor
                const atividades = yield atividadeRepo.obterPorVendedorEData(vendedor.id, dataInicio, dataFim);
                // Calcula métricas
                const diasComAtividade = atividades.length;
                const totalDocinhos = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
                const mediaPorDia = diasComAtividade > 0 ? totalDocinhos / diasComAtividade : 0;
                // Calcula FEA e IAP
                const frequencia = yield frequenciaVendasService.calcularFrequencia(equipe.id, dataInicio, dataFim);
                const fea = yield atividadeService.calcularFEA(equipe.id, frequencia.totalDiasDisponiveis, frequencia.diasComAtividade);
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
                            meta: (meta === null || meta === void 0 ? void 0 : meta.objetivo) || 0
                        }
                    }
                };
                // Gera insights
                const insights = yield getVendorInsights.execute(vendorInfo);
                return insights;
            }
            catch (error) {
                console.error(`Erro ao gerar insights para o vendedor ${vendedor.nome}:`, error);
                return null;
            }
        }));
        // Aguarda todos os insights serem gerados
        const insights = yield Promise.all(insightsPromises);
        // Filtra insights nulos e retorna o resultado
        const insightsValidos = insights.filter(insight => insight !== null);
        res.status(200).json({
            totalVendedores: insightsValidos.length,
            insights: insightsValidos
        });
    }
    catch (error) {
        console.error('Erro ao gerar insights de todos os vendedores:', error);
        res.status(500).json({
            error: 'Erro ao gerar insights dos vendedores',
            details: error.message
        });
    }
}));
exports.default = router;
