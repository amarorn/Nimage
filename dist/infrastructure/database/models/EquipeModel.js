"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const equipeSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true, trim: true },
    nome: { type: String, required: true, trim: true },
    pdv: { type: String, required: true, trim: true },
    cidade: { type: String, required: true, trim: true },
    estado: { type: String, required: true, trim: true },
    gerenteNome: { type: String, trim: true },
    gerenteTelefone: { type: String, trim: true },
    capitaoNome: { type: String, trim: true },
    capitaoTelefone: { type: String, trim: true },
    temaId: { type: String, trim: true }
}, {
    timestamps: true
});
// Índices para consultas comuns
equipeSchema.index({ cidade: 1, estado: 1 });
equipeSchema.index({ nome: 1, pdv: 1 });
equipeSchema.index({ nome: 'text', cidade: 'text', estado: 'text' });
// Validações e transformações
equipeSchema.pre('save', function (next) {
    if (this.isModified('nome')) {
        this.nome = this.nome.trim();
    }
    if (this.isModified('cidade')) {
        this.cidade = this.cidade.trim();
    }
    if (this.isModified('estado')) {
        this.estado = this.estado.trim();
    }
    next();
});
// Método estático para consulta paginada
equipeSchema.statics.findWithPagination = async function (skip, limit) {
    try {
        console.log(`🔍 Executando consulta paginada - Skip: ${skip}, Limit: ${limit}`);
        const equipes = await this.find()
            .skip(skip)
            .limit(limit)
            .sort({ nome: 1 });
        console.log(`✅ ${equipes.length} equipes encontradas`);
        return equipes;
    }
    catch (erro) {
        console.error('❌ Erro na consulta paginada:', erro);
        throw erro;
    }
};
exports.EquipeModel = mongoose_1.default.model('Equipe', equipeSchema);
//# sourceMappingURL=EquipeModel.js.map