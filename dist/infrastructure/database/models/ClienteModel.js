"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteModel = void 0;
const mongoose_1 = require("mongoose");
const clienteSchema = new mongoose_1.Schema({
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
exports.ClienteModel = (0, mongoose_1.model)('Cliente', clienteSchema);
//# sourceMappingURL=ClienteModel.js.map