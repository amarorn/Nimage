import { Schema, model, Document } from 'mongoose';

export interface ILoja extends Document {
    id: string;
    nome: string;
    cnpj: string;
    telefone: string;
    montadoraId: string;
}

const LojaSchema = new Schema<ILoja>({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    cnpj: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    montadoraId: { type: String, required: true, ref: 'Montadora' }
}, {
    timestamps: true
});

export const LojaModel = model<ILoja>('Loja', LojaSchema); 