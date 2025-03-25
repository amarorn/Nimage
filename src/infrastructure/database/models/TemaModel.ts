import mongoose, { Schema, Document } from "mongoose";

export interface ITema extends Document {
    id: string;
    nome: string;
    descricao: string;
    cor: string;
}

const TemaSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    cor: { type: String, required: true }
});

export const TemaModel = mongoose.model<ITema>("Tema", TemaSchema); 