import { Request, Response } from "express";
import { DesempenhoIdealService } from "../../application/services/DesempenhoIdealService";

export class DesempenhoIdealController {
    constructor(private desempenhoIdealService: DesempenhoIdealService) {}

    async calcularDesempenhoIdeal(req: Request, res: Response) {
        try {
            const { equipeId } = req.params;
            const { mes, ano } = req.query;

            if (!mes || !ano) {
                return res.status(400).json({
                    erro: 'Mês e ano são obrigatórios',
                    detalhes: { mes, ano }
                });
            }

            const mesNum = parseInt(mes as string);
            const anoNum = parseInt(ano as string);

            if (isNaN(mesNum) || isNaN(anoNum) || mesNum < 1 || mesNum > 12) {
                return res.status(400).json({
                    erro: 'Mês e ano inválidos',
                    detalhes: { mes: mesNum, ano: anoNum }
                });
            }

            const resultado = await this.desempenhoIdealService.calcularDesempenhoIdeal(
                equipeId,
                mesNum,
                anoNum
            );

            return res.status(200).json(resultado);
        } catch (erro) {
            console.error('Erro ao calcular desempenho ideal:', erro);
            return res.status(500).json({
                erro: 'Erro interno ao calcular desempenho ideal',
                mensagem: (erro as Error).message
            });
        }
    }
}