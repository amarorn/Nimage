"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LojaModel = void 0;
const mongoose_1 = require("mongoose");
const LojaSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    cnpj: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    montadoraId: { type: String, required: true, ref: 'Montadora' }
}, {
    timestamps: true
});
exports.LojaModel = (0, mongoose_1.model)('Loja', LojaSchema);
//# sourceMappingURL=LojaModel.js.map