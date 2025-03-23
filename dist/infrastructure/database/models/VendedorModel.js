"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendedorModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const vendedorSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    equipeId: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    meta: { type: Number, required: true },
    cargo: { type: String, required: true }
});
exports.VendedorModel = mongoose_1.default.model('Vendedor', vendedorSchema);
//# sourceMappingURL=VendedorModel.js.map