import { Vendedor } from "../../domain/entities/Vendedor";
import { Atividade } from "../../domain/entities/Atividade";
import { Equipe } from "../../domain/entities/Equipe";
import { Meta } from "../../domain/entities/Meta";

class InMemoryDatabase {
    private static instance: InMemoryDatabase;

    private vendedores: Vendedor[] = [];
    private atividades: Atividade[] = [];
    private equipes: Equipe[] = [];
    private metas: Meta[] = [];

    private constructor() {}

    public static getInstance(): InMemoryDatabase {
        if (!InMemoryDatabase.instance) {
            InMemoryDatabase.instance = new InMemoryDatabase();
        }
        return InMemoryDatabase.instance;
    }

    // Métodos para Vendedores
    public adicionarVendedor(vendedor: Vendedor): void {
        this.vendedores.push(vendedor);
    }

    public obterVendedorPorId(id: string): Vendedor | null {
        return this.vendedores.find(v => v.id === id) || null;
    }

    // Métodos para Atividades
    public adicionarAtividade(atividade: Atividade): void {
        this.atividades.push(atividade);
    }

    public obterAtividadePorId(id: string): Atividade | null {
        return this.atividades.find(a => a.id === id) || null;
    }

    public obterAtividadesPorVendedor(vendedorId: string): Atividade[] {
        return this.atividades.filter(a => a.vendedorId === vendedorId);
    }

    // Métodos para Equipes
    public adicionarEquipe(equipe: Equipe): void {
        this.equipes.push(equipe);
    }

    public obterEquipePorId(id: string): Equipe | null {
        return this.equipes.find(e => e.id === id) || null;
    }

    // Métodos para Metas
    public adicionarMeta(meta: Meta): void {
        this.metas.push(meta);
    }

    public obterMetaPorEquipe(equipeId: string): Meta | null {
        return this.metas.find(m => m.equipeId === equipeId) || null;
    }
}

export default InMemoryDatabase.getInstance();