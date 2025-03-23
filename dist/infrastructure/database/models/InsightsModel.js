"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const insightsSchema = new mongoose_1.default.Schema({
    vendedorId: { type: String, required: true },
    dataConsulta: { type: Date, default: Date.now },
    mesReferencia: { type: String, required: true },
    dados: {
        resultado: {
            vendedor: {
                nome: String,
                feaVendedor: Number,
                iapVendedor: Number,
                numeroDiasComAtividade: Number,
                somaDocinhos: Number,
                mediaAtividadePorDia: Number,
                percentualContribuicao: String,
                percentualCrescimento: String,
                pesoNaEquipe: String,
                distribuicaoMeta: String,
                desempenhoDiarioIdeal: String,
                equipe: {
                    meta: Number,
                    meta_anterior: Number,
                    totalVendedores: Number,
                    mediaEquipe: Number,
                    totalVendasMesAnterior: Number,
                    crescimentoMeta: String,
                    crescimentoVendas: String,
                    diferenca: String,
                    periodoMetaAnterior: {
                        inicio: Date,
                        fim: Date
                    }
                },
                dadosGrafico: {
                    historico: [{
                            mes: String,
                            dia: Number,
                            valor: Number,
                            tipo: String
                        }],
                    previsao: [{
                            mes: String,
                            valor: Number,
                            detalhes: [{
                                    dia: Number,
                                    valor: Number,
                                    tipo: String
                                }]
                        }],
                    meta: {
                        valor: Number,
                        tipo: String
                    },
                    media: {
                        valor: Number,
                        tipo: String
                    },
                    eixos: {
                        y1: {
                            titulo: String,
                            tipo: String
                        },
                        y2: {
                            titulo: String,
                            tipo: String
                        }
                    }
                },
                analiseHistorico: {
                    crescimentoPeriodo: String,
                    tendenciasIdentificadas: [String],
                    pontosMelhoria: [String],
                    estrategiasHistorico: [String]
                }
            }
        }
    }
});
// Índice composto para otimizar consultas
insightsSchema.index({ vendedorId: 1, mesReferencia: 1 });
exports.InsightsModel = mongoose_1.default.model('Insights', insightsSchema);
//# sourceMappingURL=InsightsModel.js.map