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
exports.ObterEquipeDadosFull = void 0;
class ObterEquipeDadosFull {
    constructor(equipeRepo, vendedorRepo, atividadeRepo, metaRepo) {
        this.equipeRepo = equipeRepo;
        this.vendedorRepo = vendedorRepo;
        this.atividadeRepo = atividadeRepo;
        this.metaRepo = metaRepo;
    }
    executar(equipeId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("🔍 Buscando dados completos da equipe:", equipeId);
            // Busca a equipe
            const equipe = yield this.equipeRepo.obterPorId(equipeId);
            if (!equipe) {
                throw new Error('Equipe não encontrada');
            }
            // Busca a meta da equipe
            const meta = yield this.metaRepo.obterPorEquipe(equipeId);
            // Busca os vendedores da equipe
            const vendedores = yield this.vendedorRepo.obterPorEquipeId(equipeId);
            // Para cada vendedor, busca suas atividades
            const vendedoresComAtividades = yield Promise.all(vendedores.map((vendedor) => __awaiter(this, void 0, void 0, function* () {
                const atividades = yield this.atividadeRepo.obterPorVendedorId(vendedor.id);
                return {
                    id: vendedor.id,
                    nome: vendedor.nome,
                    equipe_id: vendedor.equipe_id,
                    atividades: atividades.map(atividade => ({
                        id: atividade.id,
                        data: atividade.data,
                        docinhosCoco: atividade.docinhosCoco,
                        total_docinhos: atividade.docinhosCoco
                    }))
                };
            })));
            console.log("🔍 Dados completos da equipe:", vendedoresComAtividades);
            return {
                equipe: {
                    id: equipe.id,
                    nome: equipe.nome
                },
                meta: meta ? {
                    id: meta.id,
                    objetivo: meta.objetivo
                } : null,
                vendedores: vendedoresComAtividades
            };
        });
    }
}
exports.ObterEquipeDadosFull = ObterEquipeDadosFull;
