"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObterAtividadesPorVendedorEData = void 0;
class ObterAtividadesPorVendedorEData {
    constructor(atividadeService) {
        this.atividadeService = atividadeService;
    }
    async executar(vendedorId, dataInicio, dataFim) {
        return await this.atividadeService.obterAtividadesPorVendedorEData(vendedorId, dataInicio, dataFim);
    }
}
exports.ObterAtividadesPorVendedorEData = ObterAtividadesPorVendedorEData;
//# sourceMappingURL=ObterAtividadesPorVendedorEData.js.map