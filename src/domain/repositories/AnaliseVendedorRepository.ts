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
    perfilVendas: string;
    tendencias: string[];
    pontosFortes: string[];
    pontosFracos: string[];
    recomendacoes: string[];
    projecaoCrescimento: string;
    estrategiasPersonalizadas: string[];
    novaMeta: number;
    probabilidadeCrescimento: string;
    fatorAjusteMeta: number;
    historico: Array<{
        mes: string;
        valor: number;
    }>;
    previsao: Array<{
        mes: string;
        valor: number;
    }>;
    analise_historico: AnaliseHistorico;
} 