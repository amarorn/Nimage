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
exports.DesempenhoIdealService = void 0;
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
class DesempenhoIdealService {
    constructor() {
        this.vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
        this.equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
        this.metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
        this.atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
    }
    calcularDiasUteis(mes, ano) {
        const data = new Date(ano, mes - 1, 1);
        const ultimoDia = new Date(ano, mes, 0);
        let diasUteis = 0;
        for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
            const dataAtual = new Date(ano, mes - 1, dia);
            if (dataAtual.getDay() !== 0 && dataAtual.getDay() !== 6) {
                diasUteis++;
            }
        }
        return diasUteis;
    }
    calcularDesempenhoIdeal(equipeId, mes, ano) {
        return __awaiter(this, void 0, void 0, function* () {
            // Busca informações da equipe
            const equipe = yield this.equipeRepo.obterPorId(equipeId);
            if (!equipe) {
                throw new Error('Equipe não encontrada');
            }
            // Calcula período do mês anterior
            const dataInicio = new Date(ano, mes - 2, 1);
            const dataFim = new Date(ano, mes - 1, 0);
            // Busca meta do mês anterior
            const metaAnterior = yield this.metaRepo.obterPorEquipeEData(equipeId, dataInicio, dataFim);
            if (!metaAnterior) {
                throw new Error('Meta do mês anterior não encontrada');
            }
            // Busca todos os vendedores da equipe
            const vendedores = yield this.vendedorRepo.obterPorEquipeId(equipeId);
            // Calcula total de vendas do mês anterior
            let totalVendasAnterior = 0;
            const vendasPorVendedor = new Map();
            for (const vendedor of vendedores) {
                const atividades = yield this.atividadeRepo.obterPorVendedorEData(vendedor.id, dataInicio, dataFim);
                const totalVendedor = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
                vendasPorVendedor.set(vendedor.id, totalVendedor);
                totalVendasAnterior += totalVendedor;
            }
            // Calcula dias úteis do mês atual
            const diasUteis = this.calcularDiasUteis(mes, ano);
            // Calcula desempenho ideal para cada vendedor
            const desempenhoVendedores = vendedores.map((vendedor) => {
                const contribuicaoAnterior = vendasPorVendedor.get(vendedor.id) || 0;
                const porcentagemContribuicao = totalVendasAnterior > 0
                    ? (contribuicaoAnterior / totalVendasAnterior) * 100
                    : 0;
                const metaIdeal = metaAnterior.objetivo * (porcentagemContribuicao / 100);
                const mediaDiariaIdeal = metaIdeal / diasUteis;
                return {
                    vendedorId: vendedor.id,
                    nome: vendedor.nome,
                    metaIdeal,
                    contribuicaoAnterior,
                    porcentagemContribuicao,
                    diasUteis,
                    mediaDiariaIdeal
                };
            });
            return {
                equipeId: equipe.id,
                nome: equipe.nome,
                metaAnterior: metaAnterior.objetivo,
                totalVendasAnterior,
                vendedores: desempenhoVendedores
            };
        });
    }
}
exports.DesempenhoIdealService = DesempenhoIdealService;
//# sourceMappingURL=DesempenhoIdealService.js.map