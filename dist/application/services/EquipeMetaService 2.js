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
exports.EquipeMetaService = void 0;
class EquipeMetaService {
    constructor(obterEquipeDadosFull) {
        this.obterEquipeDadosFull = obterEquipeDadosFull;
    }
    calcularMeta(equipeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dadosCompletos = yield this.obterEquipeDadosFull.executar(equipeId);
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
                }, {});
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
        });
    }
}
exports.EquipeMetaService = EquipeMetaService;
