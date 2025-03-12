"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtividadeService = void 0;
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
class AtividadeService {
    constructor(atividadeRepo) {
        this.atividadeRepo = atividadeRepo;
        this.vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
        this.equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
        this.metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
    }
    obterAtividadesPorVendedorEData(vendedorId, dataInicio, dataFim) {
        return __awaiter(this, void 0, void 0, function* () {
            // Busca atividades
            const atividades = yield this.atividadeRepo.obterPorVendedorEData(vendedorId, dataInicio, dataFim);
            const quantidade = atividades.length;
            const valorTotal = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
            console.log('Debug - Buscando vendedor com ID:', vendedorId);
            // Busca informações do vendedor
            const vendedor = yield this.vendedorRepo.obterPorId(vendedorId);
            console.log('Debug - Resultado da busca do vendedor:', vendedor);
            if (!vendedor) {
                throw new Error('Vendedor não encontrado');
            }
            // Busca informações da equipe
            const equipe = yield this.equipeRepo.obterPorId(vendedor.equipe_id);
            if (!equipe) {
                throw new Error('Equipe não encontrada');
            }
            // Busca meta da equipe
            const meta = yield this.metaRepo.obterPorEquipe(equipe.id);
            return {
                quantidade,
                valorTotal,
                vendedor: {
                    id: vendedor.id,
                    nome: vendedor.nome,
                    equipe_id: vendedor.equipe_id
                },
                equipe: {
                    id: equipe.id,
                    nome: equipe.nome
                },
                meta: meta ? {
                    id: meta.id,
                    equipeId: meta.equipeId,
                    objetivo: meta.objetivo,
                    data: meta.data
                } : null
            };
        });
    }
    calcularFEA(equipeId, totalDiasDisponiveis, diasComAtividade) {
        return __awaiter(this, void 0, void 0, function* () {
            if (diasComAtividade === 0) {
                return 0;
            }
            const fea = ((totalDiasDisponiveis - diasComAtividade) / diasComAtividade) * 100;
            return fea;
        });
    }
}
exports.AtividadeService = AtividadeService;
