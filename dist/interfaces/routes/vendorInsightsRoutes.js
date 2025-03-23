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
        const { mes } = req.query; // Obtém o mês da query string
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
        // Calcula datas para análise
        const hoje = new Date();
        let dataInicio;
        let dataFim;
        let mesAnteriorInicio;
        let mesAnteriorFim;
        if (mes) {
            // Se um mês específico foi fornecido, usa esse mês
            const [ano, mesNumero] = mes.split('-').map(Number);
            dataInicio = new Date(ano, mesNumero - 1, 1);
            dataFim = new Date(ano, mesNumero, 0);
            // Calcula datas para o mês anterior
            mesAnteriorInicio = new Date(ano, mesNumero - 2, 1);
            console.log("🚀 ~ router.get ~ mesAnteriorInicio:", mesAnteriorInicio);
            mesAnteriorFim = new Date(ano, mesNumero - 1, 0);
            console.log("🚀 ~ router.get ~ mesAnteriorFim:", mesAnteriorFim);
        }
        else {
            // Se não foi fornecido mês, usa o mês atual
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            // Calcula datas para o mês anterior
            mesAnteriorInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
            mesAnteriorFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
        }
        // Busca atividades do vendedor
        const atividades = yield atividadeRepo.obterPorVendedorEData(vendedorId, dataInicio, dataFim);
        // Calcula métricas
        const diasComAtividade = atividades.length;
        const totalDocinhos = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
        const mediaPorDia = diasComAtividade > 0 ? totalDocinhos / diasComAtividade : 0;
        // Busca atividades do vendedor no mês anterior
        const atividadesMesAnterior = yield atividadeRepo.obterPorVendedorEData(vendedorId, mesAnteriorInicio, mesAnteriorFim);
        const totalDocinhosMesAnterior = atividadesMesAnterior.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
        // Busca meta da equipe do mês anterior
        const metaAnterior = yield metaRepo.obterPorEquipeEData(equipe.id, mesAnteriorInicio, mesAnteriorFim);
        // Busca todos os vendedores da equipe para calcular média
        const vendedoresEquipe = yield vendedorRepo.obterPorEquipeId(equipe.id);
        const totalVendedores = vendedoresEquipe.length;
        // Calcula total de vendas da equipe no mês anterior
        const vendasEquipeMesAnterior = yield Promise.all(vendedoresEquipe.map((v) => __awaiter(void 0, void 0, void 0, function* () {
            const atividadesVendedor = yield atividadeRepo.obterPorVendedorEData(v.id, mesAnteriorInicio, mesAnteriorFim);
            const totalVendedor = atividadesVendedor.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
            return totalVendedor;
        })));
        const totalVendasEquipeMesAnterior = vendasEquipeMesAnterior.reduce((total, valor) => total + valor, 0);
        const mediaEquipeVendas = totalVendasEquipeMesAnterior / totalVendedores;
        console.log('Dados do mês anterior:', {
            periodo: {
                inicio: mesAnteriorInicio.toISOString(),
                fim: mesAnteriorFim.toISOString()
            },
            vendasVendedor: totalDocinhosMesAnterior,
            vendasEquipe: totalVendasEquipeMesAnterior,
            metaAnterior: (metaAnterior === null || metaAnterior === void 0 ? void 0 : metaAnterior.objetivo) || 0
        });
        // Calcula FEA e IAP
        const frequencia = yield frequenciaVendasService.calcularFrequencia(equipe.id, dataInicio, dataFim);
        const fea = yield atividadeService.calcularFEA(equipe.id, frequencia.totalDiasDisponiveis, frequencia.diasComAtividade);
        const iap = mediaPorDia * (frequencia.totalDiasDisponiveis - diasComAtividade);
        // Prepara histórico de vendas por mês
        const historicoVendas = atividades.reduce((acc, atividade) => {
            const mes = atividade.data.toLocaleString('pt-BR', { month: 'long' });
            const mesExistente = acc.find(item => item.mes === mes);
            if (mesExistente) {
                mesExistente.valor += atividade.docinhosCoco;
                mesExistente.count += 1;
            }
            else {
                acc.push({
                    mes: mes.charAt(0).toUpperCase() + mes.slice(1),
                    valor: atividade.docinhosCoco,
                    count: 1
                });
            }
            return acc;
        }, []);
        // Calcula a média por mês e remove o count
        const historicoFinal = historicoVendas.map(item => ({
            mes: item.mes,
            valor: item.valor / item.count
        }));
        // Ordena histórico por mês
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        historicoFinal.sort((a, b) => meses.indexOf(a.mes) - meses.indexOf(b.mes));
        // Prepara dados para análise
        const vendorInfo = {
            resultado: {
                vendedor: {
                    nome: vendedor.nome,
                    feaVendedor: fea,
                    iapVendedor: iap,
                    numeroDiasComAtividade: diasComAtividade,
                    somaDocinhos: totalDocinhos,
                    mediaAtividadePorDia: mediaPorDia,
                    historicoVendas: historicoFinal,
                    vendasMesAnterior: totalDocinhosMesAnterior,
                    mediaEquipeMesAnterior: mediaEquipeVendas,
                    totalVendedores: totalVendedores,
                    totalVendasEquipeMesAnterior: totalVendasEquipeMesAnterior,
                    periodoAnalise: {
                        inicio: dataInicio.toISOString(),
                        fim: dataFim.toISOString()
                    }
                },
                equipe: {
                    meta: (meta === null || meta === void 0 ? void 0 : meta.objetivo) || 0,
                    meta_anterior: (metaAnterior === null || metaAnterior === void 0 ? void 0 : metaAnterior.objetivo) || 0,
                    totalVendedores: totalVendedores,
                    mediaEquipe: mediaEquipeVendas,
                    totalVendasMesAnterior: totalVendasEquipeMesAnterior
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
                // Busca todos os vendedores da equipe para calcular média
                const vendedoresEquipe = yield vendedorRepo.obterPorEquipeId(equipe.id);
                const totalVendedores = vendedoresEquipe.length;
                // Calcula média de vendas da equipe
                const mediaEquipe = yield Promise.all(vendedoresEquipe.map((v) => __awaiter(void 0, void 0, void 0, function* () {
                    const atividadesVendedor = yield atividadeRepo.obterPorVendedorEData(v.id, dataInicio, dataFim);
                    const totalVendedor = atividadesVendedor.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
                    return totalVendedor;
                })));
                const mediaEquipeVendas = mediaEquipe.reduce((total, valor) => total + valor, 0) / totalVendedores;
                // Prepara histórico de vendas por mês
                const historicoVendas = atividades.reduce((acc, atividade) => {
                    const mes = atividade.data.toLocaleString('pt-BR', { month: 'long' });
                    const mesExistente = acc.find(item => item.mes === mes);
                    if (mesExistente) {
                        mesExistente.valor += atividade.docinhosCoco;
                        mesExistente.count += 1;
                    }
                    else {
                        acc.push({
                            mes: mes.charAt(0).toUpperCase() + mes.slice(1),
                            valor: atividade.docinhosCoco,
                            count: 1
                        });
                    }
                    return acc;
                }, []);
                // Calcula a média por mês e remove o count
                const historicoFinal = historicoVendas.map(item => ({
                    mes: item.mes,
                    valor: item.valor / item.count
                }));
                // Ordena histórico por mês
                const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                historicoFinal.sort((a, b) => meses.indexOf(a.mes) - meses.indexOf(b.mes));
                // Prepara dados para análise
                const vendorInfo = {
                    resultado: {
                        vendedor: {
                            nome: vendedor.nome,
                            feaVendedor: fea,
                            iapVendedor: iap,
                            numeroDiasComAtividade: diasComAtividade,
                            somaDocinhos: totalDocinhos,
                            mediaAtividadePorDia: mediaPorDia,
                            historicoVendas: historicoFinal
                        },
                        equipe: {
                            meta: (meta === null || meta === void 0 ? void 0 : meta.objetivo) || 0,
                            totalVendedores: totalVendedores,
                            mediaEquipe: mediaEquipeVendas
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
