import { AtividadeService } from "../services/AtividadeService";

export class ObterAtividadesPorVendedorEData {
    constructor(private atividadeService: AtividadeService) {}

    async executar(vendedorId: string, dataInicio: Date, dataFim: Date): Promise<{ quantidade: number, valorTotal: number }> {
        return await this.atividadeService.obterAtividadesPorVendedorEData(vendedorId, dataInicio, dataFim);
    }
} 