export interface Venda {
    id: string;
    vendedorId: string;
    valor: number;
    data: Date;
}

export interface VendasRepository {
    obterPorVendedorId(vendedorId: string): Promise<Venda[]>;
} 