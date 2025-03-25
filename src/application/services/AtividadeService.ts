import { AtividadeRepository } from "../../domain/repositories/AtividadeRepository";
import { Atividade } from "../../domain/entities/Atividade";
import { VendedorRepository } from "../../domain/repositories/VendedorRepository";
import { EquipeRepository } from "../../domain/repositories/EquipeRepository";
import { MetaRepository } from "../../domain/repositories/MetaRepository";
import { AtividadeCacheService } from "../../infrastructure/cache/AtividadeCacheService";

export interface AtividadesPorVendedorResult {
    quantidade: number;
    valorTotal: number;
    vendedor: {
        id: string;
        nome: string;
        equipeId: string;
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
    private vendedorRepo: VendedorRepository;
    private equipeRepo: EquipeRepository;
    private metaRepo: MetaRepository;
    private atividadeRepo: AtividadeRepository;
    private cacheService: AtividadeCacheService;

    constructor(
        atividadeRepo: AtividadeRepository,
        vendedorRepo: VendedorRepository,
        equipeRepo: EquipeRepository,
        metaRepo: MetaRepository
    ) {
        this.atividadeRepo = atividadeRepo;
        this.vendedorRepo = vendedorRepo;
        this.equipeRepo = equipeRepo;
        this.metaRepo = metaRepo;
        this.cacheService = AtividadeCacheService.getInstance();
    }

    async obterAtividadesPorVendedorEData(vendedorId: string, dataInicio: Date, dataFim: Date): Promise<AtividadesPorVendedorResult> {
        // Tenta obter do cache primeiro
        const cacheKey = `${vendedorId}:${dataInicio.toISOString()}:${dataFim.toISOString()}`;
        const cachedResult = await this.cacheService.getAtividadesPorVendedorEData(vendedorId, dataInicio, dataFim);
        
        if (cachedResult) {
            const quantidade = cachedResult.length;
            const valorTotal = cachedResult.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
            
            // Busca informações do vendedor, equipe e meta em paralelo
            const [vendedor, equipe, meta] = await Promise.all([
                this.vendedorRepo.obterPorId(vendedorId),
                this.equipeRepo.obterPorId(vendedorId),
                this.metaRepo.obterPorEquipe(vendedorId)
            ]);

            if (!vendedor || !equipe) {
                throw new Error('Vendedor ou equipe não encontrado');
            }

            return {
                quantidade,
                valorTotal,
                vendedor: {
                    id: vendedor.id,
                    nome: vendedor.nome,
                    equipeId: vendedor.equipeId
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

        // Se não estiver no cache, busca do banco
        const [atividades, vendedor, equipe, meta] = await Promise.all([
            this.atividadeRepo.obterPorVendedorEData(vendedorId, dataInicio, dataFim),
            this.vendedorRepo.obterPorId(vendedorId),
            this.equipeRepo.obterPorId(vendedorId),
            this.metaRepo.obterPorEquipe(vendedorId)
        ]);

        if (!vendedor || !equipe) {
            throw new Error('Vendedor ou equipe não encontrado');
        }

        const quantidade = atividades.length;
        const valorTotal = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);

        // Salva no cache para próximas consultas
        await this.cacheService.setAtividadesPorVendedorEData(vendedorId, dataInicio, dataFim, atividades);

        return {
            quantidade,
            valorTotal,
            vendedor: {
                id: vendedor.id,
                nome: vendedor.nome,
                equipeId: vendedor.equipeId
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
        const fea = (totalDiasDisponiveis / diasComAtividade) * 100;
        return fea;
    }
}