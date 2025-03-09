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
exports.DesempenhoIdealController = void 0;
class DesempenhoIdealController {
    constructor(desempenhoIdealService) {
        this.desempenhoIdealService = desempenhoIdealService;
    }
    calcularDesempenhoIdeal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { equipeId } = req.params;
                const { mes, ano } = req.query;
                if (!mes || !ano) {
                    return res.status(400).json({
                        erro: 'Mês e ano são obrigatórios',
                        detalhes: { mes, ano }
                    });
                }
                const mesNum = parseInt(mes);
                const anoNum = parseInt(ano);
                if (isNaN(mesNum) || isNaN(anoNum) || mesNum < 1 || mesNum > 12) {
                    return res.status(400).json({
                        erro: 'Mês e ano inválidos',
                        detalhes: { mes: mesNum, ano: anoNum }
                    });
                }
                const resultado = yield this.desempenhoIdealService.calcularDesempenhoIdeal(equipeId, mesNum, anoNum);
                return res.status(200).json(resultado);
            }
            catch (erro) {
                console.error('Erro ao calcular desempenho ideal:', erro);
                return res.status(500).json({
                    erro: 'Erro interno ao calcular desempenho ideal',
                    mensagem: erro.message
                });
            }
        });
    }
}
exports.DesempenhoIdealController = DesempenhoIdealController;
