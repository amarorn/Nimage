import { Document, Schema, model } from 'mongoose';
import { ICliente } from './interfaces/ICliente';

const clienteSchema = new Schema<ICliente>({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    vendedorId: { type: String, required: false },
    endereco: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    cep: { type: String, required: true },
    dataCadastro: { type: Date, required: true, default: Date.now },
    status: { type: String, required: true, enum: ['ATIVO', 'INATIVO', 'BLOQUEADO'], default: 'ATIVO' },
    observacoes: { type: String, required: false }
}, {
    timestamps: true
});

export const ClienteModel = model<ICliente>('Cliente', clienteSchema);
export { ICliente }; 