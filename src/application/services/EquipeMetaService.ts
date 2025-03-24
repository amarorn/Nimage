import { ObterEquipeDadosFull } from "../use-cases/ObterEquipeDadosFull";

export class EquipeMetaService {
    constructor(private obterEquipeDadosFull: ObterEquipeDadosFull) {}

    async calcularMeta(equipeId: string) {
        const dadosCompletos = await this.obterEquipeDadosFull.executar(equipeId);

        const somaDocinhosPorVendedor = dadosCompletos.vendedores.map(vendedor => {
            // Agrupa atividades por ano e mês
            const desempenhoPorAnoMes = vendedor.atividades.reduce((acc, atividade) => {
                const data = new Date(atividade.data);
                const ano = data.getFullYear();
                const mes = data.getMonth() + 1; // getMonth() retorna 0-11
                const nomeMes = data.toLocaleString('pt-BR', { month: 'long' });
                
                if (!acc[ano]) {
                    acc[ano] = {};
                }
                if (!acc[ano][mes]) {
                    acc[ano][mes] = {
                        nome: nomeMes,
                        dias: {},
                        somaMes: 0
                    };
                }

                const dia = data.getDate();
                if (!acc[ano][mes].dias[dia]) {
                    acc[ano][mes].dias[dia] = 0;
                }
                acc[ano][mes].dias[dia] += atividade.docinhosCoco;

                return acc;
            }, {} as Record<number, Record<number, { nome: string, dias: Record<number, number>, somaMes: number }>>);

            // Calcula o total geral de docinhos
            const soma = vendedor.atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);

            // Adiciona somaMes para cada mês
            Object.keys(desempenhoPorAnoMes).forEach(ano => {
                Object.keys(desempenhoPorAnoMes[Number(ano)]).forEach(mes => {
                    const somaMes = Object.values(desempenhoPorAnoMes[Number(ano)][Number(mes)].dias).reduce((total: number, valor: number) => total + valor, 0);
                    desempenhoPorAnoMes[Number(ano)][Number(mes)].somaMes = somaMes;
                });
            });

            return {
                vendedorId: vendedor.id,
                vendedorNome: vendedor.nome,
                somaDocinhos: soma,
                desempenhoPorAnoMes
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