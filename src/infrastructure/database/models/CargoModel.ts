import mongoose, { Schema, Document } from "mongoose";

export interface ICargo extends Document {
    id: string;
    nome: string;
    descricao: string;
    tag: string;
}

const CargoSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    tag: { type: String, required: true }
});

export const CargoModel = mongoose.model<ICargo>("Cargo", CargoSchema); 