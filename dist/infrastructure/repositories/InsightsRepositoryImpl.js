"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightsRepositoryImpl = void 0;
const InsightsModel_1 = require("../database/models/InsightsModel");
class InsightsRepositoryImpl {
    constructor() {
        this.LIFETIME_HORAS = 48; // Tempo de vida dos insights em horas
    }
    async salvarInsights(vendedorId, mesReferencia, dados) {
        try {
            await InsightsModel_1.InsightsModel.findOneAndUpdate({ vendedorId, mesReferencia }, {
                vendedorId,
                mesReferencia,
                dataConsulta: new Date(),
                dados
            }, { upsert: true, new: true });
        }
        catch (error) {
            console.error('Erro ao salvar insights:', error);
            throw error;
        }
    }
    async obterInsightsMaisRecentes(vendedorId, mesReferencia) {
        try {
            const insights = await InsightsModel_1.InsightsModel.findOne({ vendedorId, mesReferencia })
                .sort({ dataConsulta: -1 })
                .limit(1);
            if (!insights) {
                return null;
            }
            // Verifica se os insights ainda são válidos (menos de 48h)
            const dataConsulta = new Date(insights.dataConsulta);
            const agora = new Date();
            const diferencaHoras = (agora.getTime() - dataConsulta.getTime()) / (1000 * 60 * 60);
            if (diferencaHoras > this.LIFETIME_HORAS) {
                console.log(`Insights expirados. Idade: ${diferencaHoras.toFixed(2)} horas`);
                return null;
            }
            console.log(`Insights válidos. Idade: ${diferencaHoras.toFixed(2)} horas`);
            return insights;
        }
        catch (error) {
            console.error('Erro ao obter insights:', error);
            throw error;
        }
    }
    async obterHistoricoInsights(vendedorId, limit = 10) {
        try {
            const historico = await InsightsModel_1.InsightsModel.find({ vendedorId })
                .sort({ dataConsulta: -1 })
                .limit(limit);
            return historico;
        }
        catch (error) {
            console.error('Erro ao obter histórico de insights:', error);
            throw error;
        }
    }
    async limparInsightsExpirados() {
        try {
            const dataLimite = new Date();
            dataLimite.setHours(dataLimite.getHours() - this.LIFETIME_HORAS);
            const resultado = await InsightsModel_1.InsightsModel.deleteMany({
                dataConsulta: { $lt: dataLimite }
            });
            console.log(`Insights expirados removidos: ${resultado.deletedCount}`);
        }
        catch (error) {
            console.error('Erro ao limpar insights expirados:', error);
            throw error;
        }
    }
}
exports.InsightsRepositoryImpl = InsightsRepositoryImpl;
//# sourceMappingURL=InsightsRepositoryImpl.js.map