import mongoose, { Schema, Document } from "mongoose";

export interface IEquipe extends Document {
    id: string;
    nome: string;
    pdv: string;
    cidade: string;
    estado: string;
    gerenteNome: string;
    gerenteTelefone: string;
    capitaoNome: string;
    capitaoTelefone: string;
    temaId?: string;
}

const EquipeSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    pdv: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    gerenteNome: { type: String, required: true },
    gerenteTelefone: { type: String, required: true },
    capitaoNome: { type: String, required: true },
    capitaoTelefone: { type: String, required: true },
    temaId: { type: String, required: false }
});

export const EquipeModel = mongoose.model<IEquipe>("Equipe", EquipeSchema);