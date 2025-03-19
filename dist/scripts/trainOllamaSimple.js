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
const MongoDB_1 = require("../infrastructure/database/MongoDB");
const AtividadeRepositoryImpl_1 = require("../infrastructure/repositories/AtividadeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../infrastructure/repositories/VendedorRepositoryImpl");
const EquipeRepositoryImpl_1 = require("../infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../infrastructure/repositories/MetaRepositoryImpl");
const FrequenciaVendasService_1 = require("../application/services/FrequenciaVendasService");
const ObterEquipeDadosFull_1 = require("../application/use-cases/ObterEquipeDadosFull");
const AtividadeService_1 = require("../application/services/AtividadeService");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
function trainSimpleModel() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('🚀 Iniciando treinamento do modelo...');
            // Conectar ao MongoDB
            yield MongoDB_1.MongoDB.conectar();
            // Inicializar repositórios
            const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
            const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
            const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
            const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
            // Inicializar serviços
            const obterEquipeDadosFull = new ObterEquipeDadosFull_1.ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
            const frequenciaVendasService = new FrequenciaVendasService_1.FrequenciaVendasService(obterEquipeDadosFull);
            const atividadeService = new AtividadeService_1.AtividadeService(atividadeRepo);
            // Buscar todos os vendedores
            const vendedores = yield vendedorRepo.obterTodos(0, 1000);
            console.log(`📊 Encontrados ${vendedores.length} vendedores para processar`);
            // Processar cada vendedor
            for (const vendedor of vendedores) {
                try {
                    // Buscar dados da equipe
                    const equipe = yield equipeRepo.obterPorId(vendedor.equipe_id);
                    if (!equipe)
                        continue;
                    // Buscar meta da equipe
                    const meta = yield metaRepo.obterPorEquipe(equipe.id);
                    if (!meta)
                        continue;
                    // Calcular datas para análise (últimos 6 meses)
                    const hoje = new Date();
                    const dataFim = hoje;
                    const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 6, hoje.getDate());
                    // Buscar atividades do vendedor
                    const atividades = yield atividadeRepo.obterPorVendedorEData(vendedor.id, dataInicio, dataFim);
                    // Calcular métricas
                    const diasComAtividade = atividades.length;
                    const totalDocinhos = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
                    const mediaPorDia = diasComAtividade > 0 ? totalDocinhos / diasComAtividade : 0;
                    // Calcular FEA e IAP
                    const frequencia = yield frequenciaVendasService.calcularFrequencia(equipe.id, dataInicio, dataFim);
                    const fea = yield atividadeService.calcularFEA(equipe.id, frequencia.totalDiasDisponiveis, frequencia.diasComAtividade);
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
                    // Treinar o modelo
                    const command = `ollama run nimage "${prompt}"`;
                    const { stdout } = yield execAsync(command);
                    console.log(`✅ Treinamento concluído para o vendedor ${vendedor.nome}`);
                    console.log('Resposta:', stdout);
                    yield new Promise(resolve => setTimeout(resolve, 1000)); // Delay para evitar sobrecarga
                }
                catch (error) {
                    console.error(`❌ Erro ao processar vendedor ${vendedor.nome}:`, error);
                }
            }
            console.log('🎉 Treinamento concluído com sucesso!');
        }
        catch (error) {
            console.error('❌ Erro durante o treinamento:', error);
        }
    });
}
trainSimpleModel().catch(console.error);
