import { Document, Schema, model } from 'mongoose';
import { Cliente } from '../../../domain/entities/Cliente';

const clienteSchema = new Schema<Cliente>({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    vendedorId: { type: String, required: false },
  
}, {
    timestamps: true
});

export const ClienteModel = model<Cliente>('Cliente', clienteSchema);
export { Cliente }; 