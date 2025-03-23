"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnaliseVendedorRepositoryImpl = void 0;
const AnaliseVendedorModel_1 = require("../database/models/AnaliseVendedorModel");
class AnaliseVendedorRepositoryImpl {
    async salvarAnalise(vendedorId, mesAnalise, resultado) {
        try {
            await AnaliseVendedorModel_1.AnaliseVendedorModel.create({
                vendedorId,
                mesAnalise,
                resultado
            });
            console.log('✅ Análise salva com sucesso para o vendedor:', vendedorId);
        }
        catch (error) {
            console.error('❌ Erro ao salvar análise:', error);
            throw error;
        }
    }
    async obterAnalisesPorVendedor(vendedorId) {
        try {
            const analises = await AnaliseVendedorModel_1.AnaliseVendedorModel.find({ vendedorId })
                .sort({ dataConsulta: -1 })
                .lean();
            return analises;
        }
        catch (error) {
            console.error('❌ Erro ao buscar análises:', error);
            throw error;
        }
    }
    async obterAnalisePorVendedorEMes(vendedorId, mesAnalise) {
        try {
            const analise = await AnaliseVendedorModel_1.AnaliseVendedorModel.findOne({
                vendedorId,
                mesAnalise
            }).lean();
            return analise;
        }
        catch (error) {
            console.error('❌ Erro ao buscar análise específica:', error);
            throw error;
        }
    }
    async obterUltimaAnalise(vendedorId) {
        try {
            const analise = await AnaliseVendedorModel_1.AnaliseVendedorModel.findOne({ vendedorId })
                .sort({ dataConsulta: -1 })
                .lean();
            return analise;
        }
        catch (error) {
            console.error('❌ Erro ao buscar última análise:', error);
            throw error;
        }
    }
}
exports.AnaliseVendedorRepositoryImpl = AnaliseVendedorRepositoryImpl;
//# sourceMappingURL=AnaliseVendedorRepositoryImpl.js.map