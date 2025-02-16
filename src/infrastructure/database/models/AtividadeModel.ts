import mongoose, { Schema, Document } from "mongoose";

export interface IAtividade extends Document {
    id: string;
    vendedorId: string;
    data: Date;
    docinhosCoco: number;
}

const AtividadeSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    vendedorId: { type: String, required: true },
    data: { type: Date, required: true },
    docinhosCoco: { type: Number, required: true }
});

export const AtividadeModel = mongoose.model<IAtividade>("Atividade", AtividadeSchema);