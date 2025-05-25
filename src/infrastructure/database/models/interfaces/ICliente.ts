export interface ICliente {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    vendedorId?: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    dataCadastro: Date;
    status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO';
    observacoes?: string;
} 