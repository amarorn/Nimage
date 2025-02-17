import mongoose, { Schema, Document } from "mongoose";

export interface IEquipe extends Document {
    id: string;
    nome: string;
}

const EquipeSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true }
});

export const EquipeModel = mongoose.model<IEquipe>("Equipe", EquipeSchema);