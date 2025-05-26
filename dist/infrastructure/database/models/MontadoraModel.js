"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Montadora = exports.MontadoraModel = void 0;
const mongoose_1 = require("mongoose");
const Montadora_1 = require("../../../domain/entities/Montadora");
Object.defineProperty(exports, "Montadora", { enumerable: true, get: function () { return Montadora_1.Montadora; } });
const montadoraSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    razaoSocial: { type: String, required: true },
    nomeFantasia: { type: String, required: true },
    cnpj: { type: String, required: true, unique: true },
    telefoneFixo: { type: String, required: true }
}, {
    timestamps: true
});
exports.MontadoraModel = (0, mongoose_1.model)('Montadora', montadoraSchema);
//# sourceMappingURL=MontadoraModel.js.map