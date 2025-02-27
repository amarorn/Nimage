import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";
import { Atividade } from "../../domain/entities/Atividade";

export class AtividadeService {
    constructor(private atividadeRepo: AtividadeRepository) {}

    async obterAtividadesPorVendedorEData(vendedorId: string, dataInicio: Date, dataFim: Date): Promise<{ quantidade: number, valorTotal: number }> {
        const atividades = await this.atividadeRepo.obterPorVendedorEData(vendedorId, dataInicio, dataFim);
        const quantidade = atividades.length;
        const valorTotal = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
        return { quantidade, valorTotal };
    }
} 