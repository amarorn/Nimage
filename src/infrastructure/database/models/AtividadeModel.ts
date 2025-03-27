import mongoose, { Schema, Document } from "mongoose";
import { Atividade } from '../../../domain/entities/Atividade';

export interface IAtividade extends Document {
    id: string;
    vendedorId: string;
    data: Date;
    docinhosCoco: number;
    follow_up: number;
    total_docinhos: number;
}

const AtividadeSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    vendedorId: { type: String, required: true },
    data: { type: Date, required: true },
    docinhosCoco: { type: Number, required: true },
    follow_up: { type: Number, required: true, default: 0 },
    total_docinhos: { type: Number }
});

// Índices para otimizar as queries mais comuns
AtividadeSchema.index({ vendedorId: 1, data: 1 }); // Para queries por vendedor e data
AtividadeSchema.index({ data: 1 }); // Para queries por data
AtividadeSchema.index({ vendedorId: 1 }); // Para queries por vendedor

export const AtividadeModel = mongoose.model<Atividade>("Atividade", AtividadeSchema);