import { ObterEquipeDadosFull } from "../use-cases/ObterEquipeDadosFull";

export class FrequenciaVendasService {
    constructor(private obterEquipeDadosFull: ObterEquipeDadosFull) {}

    async calcularFrequencia(equipeId: string, dataInicio: Date, dataFim: Date) {
        const dadosCompletos = await this.obterEquipeDadosFull.executar(equipeId);

        const frequenciaPorVendedor = dadosCompletos.vendedores.map(vendedor => {
            const diasComAtividade = new Set(vendedor.atividades
                .filter(atividade => atividade.data >= dataInicio && atividade.data <= dataFim)
                .map(atividade => atividade.data.toISOString().split('T')[0]));
            const numeroDiasComAtividade = diasComAtividade.size;

            const somaDocinhos = vendedor.atividades
                .filter(atividade => atividade.data >= dataInicio && atividade.data <= dataFim)
                .reduce((total, atividade) => total + atividade.docinhosCoco, 0);
            const mediaAtividadePorDia = numeroDiasComAtividade > 0 ? somaDocinhos / numeroDiasComAtividade : 0;

            return {
                vendedorId: vendedor.id,
                vendedorNome: vendedor.nome,
                numeroDiasComAtividade,
                somaDocinhos,
                mediaAtividadePorDia
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
            frequenciaAtividadeEquipe
        };
    }
} 