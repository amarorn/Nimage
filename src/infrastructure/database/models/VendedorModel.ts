import mongoose from 'mongoose';

const vendedorSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    equipeId: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    meta: { type: Number, required: true },
    cargo: { type: String, required: true }
});

export const VendedorModel = mongoose.model('Vendedor', vendedorSchema);