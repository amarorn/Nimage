import mongoose from 'mongoose';

const equipeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    nomepdv: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
    gerente: { type: String, required: true },
    contato_gerente: { type: String, required: true },
    capitao: { type: String, required: true },
    contato_capitao: { type: String, required: true }
});

export const EquipeModel = mongoose.model('Equipe', equipeSchema);