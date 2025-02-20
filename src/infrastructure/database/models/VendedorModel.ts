import mongoose, { Schema, Document } from "mongoose";

export interface IVendedor extends Document {
    id: string;
    nome: string;
    equipe_id: string;
}

const VendedorSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    equipe_id: { type: String, required: true }
});

export const VendedorModel = mongoose.model<IVendedor>("Vendedor", VendedorSchema);