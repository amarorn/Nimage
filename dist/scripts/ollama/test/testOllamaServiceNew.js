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
const OllamaService_1 = require("@/application/services/OllamaService");
function testOllamaService() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        try {
            console.log('🚀 Iniciando teste do OllamaService...');
            const ollamaService = new OllamaService_1.OllamaService();
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
            const insights = yield ollamaService.getInsights(vendorInfo);
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
            console.log(`Percentual de Contribuição: ${(_a = vendedor.percentual_contribuicao) === null || _a === void 0 ? void 0 : _a.toFixed(2)}%`);
            console.log(`Peso na Equipe: ${(_b = (vendedor.peso_vendedor * 100)) === null || _b === void 0 ? void 0 : _b.toFixed(2)}%`);
            console.log(`Distribuição da Meta: ${(_c = vendedor.distribuicao_meta) === null || _c === void 0 ? void 0 : _c.toLocaleString('pt-BR')}`);
            console.log(`Desempenho Diário Ideal: ${(_d = vendedor.desempenho_diario_ideal) === null || _d === void 0 ? void 0 : _d.toLocaleString('pt-BR')}`);
            // Análise Qualitativa
            console.log('\n🎯 Análise Qualitativa:');
            console.log('----------------------');
            console.log('📈 Perfil de Vendas:', vendedor.perfil_vendas || 'Não disponível');
            console.log('\n📊 Tendências:', ((_e = vendedor.tendencias) === null || _e === void 0 ? void 0 : _e.join('\n- ')) || 'Não disponível');
            console.log('\n💪 Pontos Fortes:', ((_f = vendedor.pontos_fortes) === null || _f === void 0 ? void 0 : _f.join('\n- ')) || 'Não disponível');
            console.log('\n⚠️ Pontos Fracos:', ((_g = vendedor.pontos_fracos) === null || _g === void 0 ? void 0 : _g.join('\n- ')) || 'Não disponível');
            console.log('\n🎯 Recomendações:', ((_h = vendedor.recomendacoes) === null || _h === void 0 ? void 0 : _h.join('\n- ')) || 'Não disponível');
            // Projeções e Metas
            console.log('\n🎯 Projeções e Metas:');
            console.log('--------------------');
            console.log('📈 Projeção de Crescimento:', vendedor.projecao_crescimento || 'Não disponível');
            console.log('📊 Probabilidade de Crescimento:', vendedor.probabilidade_crescimento || 'Não disponível');
            console.log('⚖️ Fator de Ajuste de Meta:', vendedor.fator_ajuste_meta || 'Não disponível');
            console.log('🎯 Nova Meta Sugerida:', ((_j = vendedor.nova_meta_sugerida) === null || _j === void 0 ? void 0 : _j.toLocaleString('pt-BR')) || 'Não disponível');
            // Dados para Gráficos
            console.log('\n📊 Dados para Gráficos:');
            console.log('---------------------');
            console.log('Histórico:');
            if (((_l = (_k = vendedor.dados_grafico) === null || _k === void 0 ? void 0 : _k.historico) === null || _l === void 0 ? void 0 : _l.length) > 0) {
                vendedor.dados_grafico.historico.forEach((item) => {
                    console.log(`${item.mes}: ${item.valor.toLocaleString('pt-BR')}`);
                });
            }
            else {
                console.log('Não disponível');
            }
            console.log('\nPrevisão:');
            if (((_o = (_m = vendedor.dados_grafico) === null || _m === void 0 ? void 0 : _m.previsao) === null || _o === void 0 ? void 0 : _o.length) > 0) {
                vendedor.dados_grafico.previsao.forEach((item) => {
                    console.log(`${item.mes}: ${item.valor.toLocaleString('pt-BR')}`);
                });
            }
            else {
                console.log('Não disponível');
            }
            // Análise do Histórico
            if (vendedor.analise_historico) {
                console.log('\n📈 Análise do Histórico:');
                console.log('----------------------');
                console.log('Crescimento no Período:', vendedor.analise_historico.crescimento_periodo || 'Não disponível');
                console.log('\nTendências Identificadas:');
                if (((_p = vendedor.analise_historico.tendencias_identificadas) === null || _p === void 0 ? void 0 : _p.length) > 0) {
                    console.log(vendedor.analise_historico.tendencias_identificadas.join('\n- '));
                }
                else {
                    console.log('Não disponível');
                }
                console.log('\nPontos de Melhoria:');
                if (((_q = vendedor.analise_historico.pontos_melhoria) === null || _q === void 0 ? void 0 : _q.length) > 0) {
                    console.log(vendedor.analise_historico.pontos_melhoria.join('\n- '));
                }
                else {
                    console.log('Não disponível');
                }
                console.log('\nEstratégias Baseadas no Histórico:');
                if (((_r = vendedor.analise_historico.estrategias_historico) === null || _r === void 0 ? void 0 : _r.length) > 0) {
                    console.log(vendedor.analise_historico.estrategias_historico.join('\n- '));
                }
                else {
                    console.log('Não disponível');
                }
            }
            console.log('\n🎉 Teste concluído com sucesso!');
        }
        catch (error) {
            console.error('❌ Erro durante o teste:', error);
        }
    });
}
testOllamaService().catch(console.error);
//# sourceMappingURL=testOllamaServiceNew.js.map