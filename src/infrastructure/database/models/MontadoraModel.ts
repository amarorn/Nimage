import { Schema, model } from 'mongoose';
import { Montadora } from '../../../domain/entities/Montadora';

const montadoraSchema = new Schema<Montadora>({
    id: { type: String, required: true, unique: true },
    razaoSocial: { type: String, required: true },
    nomeFantasia: { type: String, required: true },
    cnpj: { type: String, required: true, unique: true },
    telefoneFixo: { type: String, required: true }
}, {
    timestamps: true
});

export const MontadoraModel = model<Montadora>('Montadora', montadoraSchema);
export { Montadora }; 