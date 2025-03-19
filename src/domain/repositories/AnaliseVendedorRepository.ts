export interface DadosGrafico {
    historico: Array<{
        mes: string;
        dia: number;
        valor: number;
    }>;
    previsao: Array<{
        mes: string;
        valor: number;
    }>;
}

export interface AnaliseHistorico {
    crescimento_periodo: string;
    tendencias_identificadas: string[];
    pontos_melhoria: string[];
    estrategias_historico: string[];
}

export interface AnaliseVendedor {
    perfil_vendas: string;
    tendencias: string[];
    pontos_fortes: string[];
    pontos_fracos: string[];
    recomendacoes: string[];
    projecao_crescimento: string;
    estrategias_personalizadas: string[];
    nova_meta_sugerida: number;
    probabilidade_crescimento: string;
    fator_ajuste_meta: string;
    dados_grafico: DadosGrafico;
    analise_historico: AnaliseHistorico;
} 