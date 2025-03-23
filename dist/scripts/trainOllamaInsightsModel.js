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
const OllamaService_1 = require("../application/services/OllamaService");
const AtividadeRepositoryImpl_1 = require("../infrastructure/repositories/AtividadeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../infrastructure/repositories/VendedorRepositoryImpl");
const EquipeRepositoryImpl_1 = require("../infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../infrastructure/repositories/MetaRepositoryImpl");
const FrequenciaVendasService_1 = require("../application/services/FrequenciaVendasService");
const ObterEquipeDadosFull_1 = require("../application/use-cases/ObterEquipeDadosFull");
const AtividadeService_1 = require("../application/services/AtividadeService");
const MongoDB_1 = require("../infrastructure/database/MongoDB");
function trainInsightsModel() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🚀 Iniciando treinamento do modelo de insights Ollama...');
        try {
            // Conecta ao MongoDB
            console.log('🔄 Conectando ao MongoDB...');
            yield MongoDB_1.MongoDB.conectar();
            console.log('✅ Conectado ao MongoDB com sucesso!');
            const ollamaService = new OllamaService_1.OllamaService();
            const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
            const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
            const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
            const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
            const obterEquipeDadosFull = new ObterEquipeDadosFull_1.ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
            const frequenciaVendasService = new FrequenciaVendasService_1.FrequenciaVendasService(obterEquipeDadosFull);
            const atividadeService = new AtividadeService_1.AtividadeService(atividadeRepo);
            // Busca todos os vendedores
            const vendedores = yield vendedorRepo.obterTodos(0, 1000);
            console.log(`📊 Encontrados ${vendedores.length} vendedores para treinamento`);
            // Calcula datas para análise (últimos 6 meses)
            const hoje = new Date();
            const dataFim = hoje;
            const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 6, hoje.getDate());
            // Array para armazenar exemplos de treinamento
            const trainingExamples = [];
            for (const vendedor of vendedores) {
                try {
                    // Busca dados da equipe
                    const equipe = yield equipeRepo.obterPorId(vendedor.equipe_id);
                    if (!equipe)
                        continue;
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
                    // Prepara exemplo de treinamento
                    const example = {
                        prompt: `Analise o desempenho do vendedor ${vendedor.nome} com base nos seguintes dados:

Métricas Atuais:
- FEA (Fator de Eficiência de Atividade): ${fea}
- IAP (Indicador de Atividade Potencial): ${iap}
- Dias com Atividade: ${diasComAtividade}
- Total de Docinhos Vendidos: ${totalDocinhos}
- Média por Dia: ${mediaPorDia}

Meta da Equipe:
- Objetivo: ${(meta === null || meta === void 0 ? void 0 : meta.objetivo) || 0}

Por favor, forneça uma análise detalhada incluindo:
1. Perfil de vendas
2. Pontos fortes e fracos
3. Recomendações
4. Projeção de crescimento
5. Probabilidade de crescimento
6. Fator de ajuste de meta`,
                        completion: `{
  "perfil_vendas": "${diasComAtividade > 100 ? 'Vendedor experiente com excelente performance' : diasComAtividade > 50 ? 'Vendedor intermediário com boa performance' : 'Vendedor iniciante com potencial de crescimento'}",
  "pontos_fortes": [
    "${mediaPorDia > 150 ? 'Alta produtividade diária' : mediaPorDia > 100 ? 'Boa produtividade diária' : 'Consistência nas atividades'}",
    "${fea > 1.5 ? 'Excelente eficiência operacional' : fea > 1.0 ? 'Boa eficiência operacional' : 'Dedicação nas atividades'}"
  ],
  "pontos_fracos": [
    "${mediaPorDia < 100 ? 'Baixa produtividade diária' : mediaPorDia < 150 ? 'Produtividade pode melhorar' : 'Possível sobrecarga de trabalho'}",
    "${fea < 1.0 ? 'Baixa eficiência operacional' : fea < 1.5 ? 'Eficiência pode melhorar' : 'Possível necessidade de mais desafios'}"
  ],
  "recomendacoes": [
    "${mediaPorDia < 100 ? 'Focar em aumentar a produtividade diária' : mediaPorDia < 150 ? 'Manter a produtividade e buscar melhorias' : 'Compartilhar boas práticas com a equipe'}",
    "${fea < 1.0 ? 'Melhorar a eficiência operacional' : fea < 1.5 ? 'Manter a eficiência e buscar melhorias' : 'Mentorar outros vendedores'}"
  ],
  "projecao_crescimento": "${mediaPorDia > 150 ? 'Alto potencial de crescimento' : mediaPorDia > 100 ? 'Bom potencial de crescimento' : 'Potencial de crescimento moderado'}",
  "probabilidade_crescimento": "${mediaPorDia > 150 ? '30% a 40%' : mediaPorDia > 100 ? '20% a 30%' : '10% a 20%'}",
  "fator_ajuste_meta": "${(mediaPorDia / 150).toFixed(4)}"
}`
                    };
                    trainingExamples.push(example);
                    console.log(`✅ Processado vendedor: ${vendedor.nome}`);
                }
                catch (error) {
                    console.error(`❌ Erro ao processar vendedor ${vendedor.nome}:`, error);
                }
            }
            console.log(`\n📚 Total de exemplos de treinamento gerados: ${trainingExamples.length}`);
            // Treina o modelo com os exemplos
            console.log('\n🔄 Iniciando treinamento do modelo...');
            for (let i = 0; i < trainingExamples.length; i++) {
                const example = trainingExamples[i];
                yield ollamaService.trainModel(example);
                console.log(`✅ Exemplo ${i + 1}/${trainingExamples.length} processado`);
            }
            console.log('\n🎉 Treinamento concluído com sucesso!');
        }
        catch (error) {
            console.error('❌ Erro durante o treinamento:', error);
        }
    });
}
trainInsightsModel();
