import { AtividadeService } from "../services/AtividadeService";
import { AtividadesPorVendedorResult } from "../services/AtividadeService";

export class ObterAtividadesPorVendedorEData {
    constructor(private atividadeService: AtividadeService) {}

    async executar(vendedorId: string, dataInicio: Date, dataFim: Date): Promise<AtividadesPorVendedorResult> {
        return await this.atividadeService.obterAtividadesPorVendedorEData(vendedorId, dataInicio, dataFim);
    }
} 