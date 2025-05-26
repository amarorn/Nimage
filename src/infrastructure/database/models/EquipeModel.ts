import mongoose, { Document, Model } from 'mongoose';

export interface IEquipe extends Document {
    id: string;
    nome: string;
    pdv: string;
    cidade: string;
    estado: string;
    lojaId: string;
    gerenteNome?: string;
    gerenteTelefone?: string;
    capitaoNome?: string;
    capitaoTelefone?: string;
    temaId?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface IEquipeModel extends Model<IEquipe> {
    findWithPagination(skip: number, limit: number): Promise<IEquipe[]>;
}

const equipeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, trim: true },
    nome: { type: String, required: true, trim: true },
    pdv: { type: String, required: true, trim: true },
    cidade: { type: String, required: true, trim: true },
    estado: { type: String, required: true, trim: true },
    lojaId: { type: String, required: true, trim: true },
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
equipeSchema.index({ nome: 'text', cidade: 'text', estado: 'text' }); // Índice para busca por texto
equipeSchema.index({ lojaId: 1 }); // Índice para busca por lojaId

// Validações e transformações
equipeSchema.pre('save', function(next) {
    if (this.isModified('nome')) {
        this.nome = this.nome.trim();
    }
    if (this.isModified('cidade')) {
        this.cidade = this.cidade.trim();
    }
    if (this.isModified('estado')) {
        this.estado = this.estado.trim();
    }
    if (this.isModified('lojaId')) {
        this.lojaId = this.lojaId.trim();
    }
    next();
});

// Método estático para consulta paginada
equipeSchema.statics.findWithPagination = async function(skip: number, limit: number): Promise<IEquipe[]> {
    try {
        console.log(`🔍 Executando consulta paginada - Skip: ${skip}, Limit: ${limit}`);
        const equipes = await this.find()
            .skip(skip)
            .limit(limit)
            .sort({ nome: 1 });
        
        console.log(`✅ ${equipes.length} equipes encontradas`);
        return equipes;
    } catch (erro) {
        console.error('❌ Erro na consulta paginada:', erro);
        throw erro;
    }
};

export const EquipeModel = mongoose.model<IEquipe, IEquipeModel>('Equipe', equipeSchema);