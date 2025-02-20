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
exports.TotaisService = void 0;
class TotaisService {
    constructor(metaRepository, atividadeRepository) {
        this.metaRepository = metaRepository;
        this.atividadeRepository = atividadeRepository;
    }
    calcularTotaisPorEquipe(equipeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const metas = yield this.metaRepository.obterPorEquipe(equipeId);
            const atividades = yield this.atividadeRepository.obterAtividadesPorEquipe(equipeId);
            const totalMetas = metas ? metas.objetivo : 0;
            const totalDocinhosCoco = atividades.reduce((total, atividade) => total + atividade.docinhosCoco, 0);
            return {
                totalMetas,
                totalDocinhosCoco
            };
        });
    }
}
exports.TotaisService = TotaisService;
