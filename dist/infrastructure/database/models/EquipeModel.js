"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const equipeSchema = new mongoose_1.default.Schema({
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
exports.EquipeModel = mongoose_1.default.model('Equipe', equipeSchema);
//# sourceMappingURL=EquipeModel.js.map