"use strict";
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
    async calcularDesempenhoIdeal(equipeId, mes, ano) {
        // Busca informações da equipe
        const equipe = await this.equipeRepo.obterPorId(equipeId);
        if (!equipe) {
            throw new Error('Equipe não encontrada');
        }
        // Calcula período do mês anterior
        const dataInicio = new Date(ano, mes - 2, 1);
        const dataFim = new Date(ano, mes - 1, 0);
        // Busca meta do mês anterior
        const metaAnterior = await this.metaRepo.obterPorEquipeEData(equipeId, dataInicio, dataFim);
        if (!metaAnterior) {
            // Se não houver meta anterior, retorna um objeto com valores zerados
            return {
                equipeId: equipe.id,
                nome: equipe.nome,
                metaAnterior: 0,
                totalVendasAnterior: 0,
                vendedores: await this.vendedorRepo.obterPorEquipeId(equipeId).then(vendedores => vendedores.map((vendedor) => ({
                    vendedorId: vendedor.id,
                    nome: vendedor.nome,
                    metaIdeal: 0,
                    contribuicaoAnterior: 0,
                    porcentagemContribuicao: 0,
                    diasUteis: this.calcularDiasUteis(mes, ano),
                    mediaDiariaIdeal: 0
                })))
            };
        }
        // Busca todos os vendedores da equipe
        const vendedores = await this.vendedorRepo.obterPorEquipeId(equipeId);
        // Calcula total de vendas do mês anterior
        let totalVendasAnterior = 0;
        const vendasPorVendedor = new Map();
        for (const vendedor of vendedores) {
            const atividades = await this.atividadeRepo.obterPorVendedorEData(vendedor.id, dataInicio, dataFim);
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
    }
}
exports.DesempenhoIdealService = DesempenhoIdealService;
//# sourceMappingURL=DesempenhoIdealService.js.map