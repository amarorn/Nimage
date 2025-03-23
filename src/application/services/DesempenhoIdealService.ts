import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { Vendedor } from "../../domain/entities/Vendedor";

interface DesempenhoIdealVendedor {
    vendedorId: string;
    nome: string;
    metaIdeal: number;
    contribuicaoAnterior: number;
    porcentagemContribuicao: number;
    diasUteis: number;
    mediaDiariaIdeal: number;
}

interface DesempenhoIdealEquipe {
    equipeId: string;
    nome: string;
    metaAnterior: number;
    totalVendasAnterior: number;
    vendedores: DesempenhoIdealVendedor[];
}

export class DesempenhoIdealService {
    private vendedorRepo: VendedorRepositoryImpl;
    private equipeRepo: EquipeRepositoryImpl;
    private metaRepo: MetaRepositoryImpl;
    private atividadeRepo: AtividadeRepositoryImpl;

    constructor() {
        this.vendedorRepo = new VendedorRepositoryImpl();
        this.equipeRepo = new EquipeRepositoryImpl();
        this.metaRepo = new MetaRepositoryImpl();
        this.atividadeRepo = new AtividadeRepositoryImpl();
    }

    private calcularDiasUteis(mes: number, ano: number): number {
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

    async calcularDesempenhoIdeal(equipeId: string, mes: number, ano: number): Promise<DesempenhoIdealEquipe> {
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
            throw new Error('Meta do mês anterior não encontrada');
        }

        // Busca todos os vendedores da equipe
        const vendedores = await this.vendedorRepo.obterPorEquipeId(equipeId);
        
        // Calcula total de vendas do mês anterior
        let totalVendasAnterior = 0;
        const vendasPorVendedor = new Map<string, number>();

        for (const vendedor of vendedores) {
            const atividades = await this.atividadeRepo.obterPorVendedorEData(
                vendedor.id,
                dataInicio,
                dataFim
            );
            
            const totalVendedor = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
            vendasPorVendedor.set(vendedor.id, totalVendedor);
            totalVendasAnterior += totalVendedor;
        }

        // Calcula dias úteis do mês atual
        const diasUteis = this.calcularDiasUteis(mes, ano);

        // Calcula desempenho ideal para cada vendedor
        const desempenhoVendedores: DesempenhoIdealVendedor[] = vendedores.map((vendedor: Vendedor) => {
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