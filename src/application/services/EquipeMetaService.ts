import { ObterEquipeDadosFull } from "../use-cases/ObterEquipeDadosFull";

export class EquipeMetaService {
    constructor(private obterEquipeDadosFull: ObterEquipeDadosFull) {}

    async calcularMeta(equipeId: string) {
        const dadosCompletos = await this.obterEquipeDadosFull.executar(equipeId);

        const somaDocinhosPorVendedor = dadosCompletos.vendedores.map(vendedor => {
            const soma = vendedor.atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);

            // Calcular o desempenho diário
            const desempenhoDiario = vendedor.atividades.reduce((acc, atividade) => {
                const data = atividade.data.toISOString().split('T')[0]; // Formatar a data como YYYY-MM-DD
                if (!acc[data]) {
                    acc[data] = 0;
                }
                acc[data] += atividade.docinhosCoco;
                return acc;
            }, {} as Record<string, number>);

            // Calcular o total do desempenho diário
            const totalDesempenho = Object.values(desempenhoDiario).reduce((total, valor) => total + valor, 0);

            return {
                vendedorId: vendedor.id,
                vendedorNome: vendedor.nome,
                somaDocinhos: soma,
                desempenhoDiario,
                totalDesempenho
            };
        });

        const somaTotalDocinhos = somaDocinhosPorVendedor.reduce((total, vendedor) => total + vendedor.somaDocinhos, 0);

        return {
            equipe: dadosCompletos.equipe,
            meta: dadosCompletos.meta,
            somaDocinhosPorVendedor,
            somaTotalDocinhos
        };
    }
}