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
exports.FrequenciaVendasService = void 0;
class FrequenciaVendasService {
    constructor(obterEquipeDadosFull) {
        this.obterEquipeDadosFull = obterEquipeDadosFull;
    }
    calcularFrequencia(equipeId, dataInicio, dataFim) {
        return __awaiter(this, void 0, void 0, function* () {
            const dadosCompletos = yield this.obterEquipeDadosFull.executar(equipeId);
            const frequenciaPorVendedor = dadosCompletos.vendedores.map(vendedor => {
                const diasComAtividade = new Set(vendedor.atividades
                    .filter(atividade => atividade.data >= dataInicio && atividade.data <= dataFim)
                    .map(atividade => atividade.data.toISOString().split('T')[0]));
                const numeroDiasComAtividade = diasComAtividade.size;
                const somaDocinhos = vendedor.atividades
                    .filter(atividade => atividade.data >= dataInicio && atividade.data <= dataFim)
                    .reduce((total, atividade) => total + atividade.docinhosCoco, 0);
                const mediaAtividadePorDia = numeroDiasComAtividade > 0 ? somaDocinhos / numeroDiasComAtividade : 0;
                const totalDiasDisponiveis = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                console.log("🚀 ~ FrequenciaVendasService ~ calcularFrequencia ~ diasComAtividade:", numeroDiasComAtividade);
                console.log("🚀 ~ FrequenciaVendasService ~ calcularFrequencia ~ totalDiasDisponiveis:", totalDiasDisponiveis);
                const subtrair = totalDiasDisponiveis - numeroDiasComAtividade;
                console.log("🚀 ~ FrequenciaVendasService ~ calcularFrequencia ~ totalDiasDisponiveis:", subtrair);
                const dividir = subtrair / numeroDiasComAtividade;
                console.log("🚀 ~ FrequenciaVendasService ~ calcularFrequencia ~ dividir:", dividir);
                const fea = ((totalDiasDisponiveis - numeroDiasComAtividade) / numeroDiasComAtividade) * 100;
                const diasPotenciaisVendedor = (numeroDiasComAtividade * fea / 100) + 1;
                const iapVendedor = mediaAtividadePorDia * (diasPotenciaisVendedor - numeroDiasComAtividade);
                return {
                    vendedorId: vendedor.id,
                    vendedorNome: vendedor.nome,
                    numeroDiasComAtividade,
                    somaDocinhos,
                    mediaAtividadePorDia,
                    feaVendedor: fea,
                    diasPotenciaisVendedor,
                    iapVendedor
                };
            });
            const somaTotalDocinhos = frequenciaPorVendedor.reduce((total, vendedor) => total + vendedor.somaDocinhos, 0);
            const totalDiasComAtividade = new Set(dadosCompletos.vendedores
                .flatMap(vendedor => vendedor.atividades
                .filter(atividade => atividade.data >= dataInicio && atividade.data <= dataFim)
                .map(atividade => atividade.data.toISOString().split('T')[0]))).size;
            const mediaAtividadePorDiaEquipe = totalDiasComAtividade > 0 ? somaTotalDocinhos / totalDiasComAtividade : 0;
            const vendedoresAltaFrequencia = frequenciaPorVendedor.filter(vendedor => vendedor.mediaAtividadePorDia > mediaAtividadePorDiaEquipe);
            const vendedoresBaixaFrequencia = frequenciaPorVendedor.filter(vendedor => vendedor.mediaAtividadePorDia <= mediaAtividadePorDiaEquipe);
            const totalDiasPassados = Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const somaTotalDiasComAtividade = totalDiasComAtividade;
            const somaTotalValorAtividades = somaTotalDocinhos;
            const quantidadeTotalAtividades = frequenciaPorVendedor.reduce((total, vendedor) => total + vendedor.numeroDiasComAtividade, 0);
            const mediaAtividadeGeralEquipe = somaTotalDocinhos / totalDiasPassados;
            const frequenciaAtividadeEquipe = (totalDiasComAtividade / totalDiasPassados) * 100;
            const totalDiasDisponiveis = totalDiasPassados;
            const feaEquipe = ((totalDiasDisponiveis - totalDiasComAtividade) / totalDiasComAtividade) * 100;
            const diasPotenciaisEquipe = (totalDiasComAtividade * feaEquipe / 100) + 1;
            const iapEquipe = mediaAtividadePorDiaEquipe * (diasPotenciaisEquipe - totalDiasComAtividade);
            return {
                equipe: dadosCompletos.equipe,
                frequenciaPorVendedor,
                mediaAtividadePorDiaEquipe,
                vendedoresAltaFrequencia,
                vendedoresBaixaFrequencia,
                somaTotalDiasComAtividade,
                somaTotalValorAtividades,
                quantidadeTotalAtividades,
                mediaAtividadeGeralEquipe,
                frequenciaAtividadeEquipe,
                totalDiasDisponiveis,
                diasComAtividade: totalDiasComAtividade,
                feaEquipe,
                diasPotenciaisEquipe,
                iapEquipe
            };
        });
    }
}
exports.FrequenciaVendasService = FrequenciaVendasService;
