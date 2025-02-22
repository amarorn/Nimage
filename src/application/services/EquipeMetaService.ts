import { ObterEquipeDadosFull } from "../use-cases/ObterEquipeDadosFull";

export class EquipeMetaService {
    constructor(private obterEquipeDadosFull: ObterEquipeDadosFull) {}

    async calcularMeta(equipeId: string) {
        const dadosCompletos = await this.obterEquipeDadosFull.executar(equipeId);

        const somaDocinhosPorVendedor = dadosCompletos.vendedores.map(vendedor => {
            const soma = vendedor.atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
            return {
                vendedorId: vendedor.id,
                somaDocinhos: soma
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