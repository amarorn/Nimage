export class Vendedor {
    constructor(
        public readonly id: string,
        public nome: string,
        public equipe_id: string,
        public equipeDetalhes?: { id: string; nome: string } | null,
        public feaVendedor?: number,
        public iapVendedor?: number,
        public mediaAtividadePorDia?: number,
        public numeroDiasComAtividade?: number,
        public somaDocinhos?: number,
        public nova_meta_sugerida?: number,
        public probabilidade_crescimento?: string,
        public fator_ajuste_meta?: number,
        public perfil_vendas?: string,
        public tendencias?: string[],
        public pontos_fortes?: string[],
        public pontos_fracos?: string[],
        public recomendacoes?: string[],
        public projecao_crescimento?: string,
        public estrategias_personalizadas?: string[],
        public dados_grafico?: {
            historico: Array<{ mes: string; valor: number }>;
            previsao: Array<{ mes: string; valor: number }>;
        }
    ) {}
}