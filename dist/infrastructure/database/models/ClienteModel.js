"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = exports.ClienteModel = void 0;
const mongoose_1 = require("mongoose");
const Cliente_1 = require("../../../domain/entities/Cliente");
Object.defineProperty(exports, "Cliente", { enumerable: true, get: function () { return Cliente_1.Cliente; } });
const clienteSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    vendedorId: { type: String, required: false },
}, {
    timestamps: true
});
exports.ClienteModel = (0, mongoose_1.model)('Cliente', clienteSchema);
//# sourceMappingURL=ClienteModel.js.map