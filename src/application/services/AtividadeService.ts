import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";
import { Atividade } from "../../domain/entities/Atividade";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";

export interface AtividadesPorVendedorResult {
    quantidade: number;
    valorTotal: number;
    vendedor: {
        id: string;
        nome: string;
        equipe_id: string;
    };
    equipe: {
        id: string;
        nome: string;
    };
    meta: {
        id: string;
        equipeId: string;
        objetivo: number;
        data: Date;
    } | null;
}

export class AtividadeService {
    private vendedorRepo: VendedorRepositoryImpl;
    private equipeRepo: EquipeRepositoryImpl;
    private metaRepo: MetaRepositoryImpl;

    constructor(private atividadeRepo: AtividadeRepository) {
        this.vendedorRepo = new VendedorRepositoryImpl();
        this.equipeRepo = new EquipeRepositoryImpl();
        this.metaRepo = new MetaRepositoryImpl();
    }

    async obterAtividadesPorVendedorEData(vendedorId: string, dataInicio: Date, dataFim: Date): Promise<{ 
        quantidade: number;
        valorTotal: number;
        vendedor: any;
        equipe: any;
        meta: any;
    }> {
        // Busca atividades
        const atividades = await this.atividadeRepo.obterPorVendedorEData(vendedorId, dataInicio, dataFim);
        const quantidade = atividades.length;
        const valorTotal = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);

        console.log('Debug - Buscando vendedor com ID:', vendedorId);

        // Busca informações do vendedor
        const vendedor = await this.vendedorRepo.obterPorId(vendedorId);
        console.log('Debug - Resultado da busca do vendedor:', vendedor);

        if (!vendedor) {
            throw new Error('Vendedor não encontrado');
        }

        // Busca informações da equipe
        const equipe = await this.equipeRepo.obterPorId(vendedor.equipe_id);
        if (!equipe) {
            throw new Error('Equipe não encontrada');
        }

        // Busca meta da equipe
        const meta = await this.metaRepo.obterPorEquipe(equipe.id);

        return { 
            quantidade, 
            valorTotal,
            vendedor: {
                id: vendedor.id,
                nome: vendedor.nome,
                equipe_id: vendedor.equipe_id
            },
            equipe: {
                id: equipe.id,
                nome: equipe.nome
            },
            meta: meta ? {
                id: meta.id,
                equipeId: meta.equipeId,
                objetivo: meta.objetivo,
                data: meta.data
            } : null
        };
    }

    async calcularFEA(equipeId: string, totalDiasDisponiveis: number, diasComAtividade: number): Promise<number> {
        if (diasComAtividade === 0) {
            return 0;
        }
        const fea = ((totalDiasDisponiveis - diasComAtividade) / diasComAtividade) * 100;
        return fea;
    }
}