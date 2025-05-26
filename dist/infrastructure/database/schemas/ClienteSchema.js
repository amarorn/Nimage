"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const clienteSchema = new mongoose_1.default.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefone: {
        type: String,
        required: true
    },
    vendedorId: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});
exports.ClienteModel = mongoose_1.default.model('Cliente', clienteSchema);
//# sourceMappingURL=ClienteSchema.js.map