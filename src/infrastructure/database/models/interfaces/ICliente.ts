import { Document } from 'mongoose';

export interface ICliente extends Document {
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