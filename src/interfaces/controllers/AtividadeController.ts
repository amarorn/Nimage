import { Request, Response } from "express";
import { CriarAtividade } from "../../application/use-cases/CriarAtividade";

export class AtividadeController {
    constructor(private criarAtividade: CriarAtividade) {}

    async criar(req: Request, res: Response) {
        const { id, vendedorId, data, docinhosCoco } = req.body;
        const atividade = await this.criarAtividade.executar({ id, vendedorId, data: new Date(data), docinhosCoco });
        res.status(201).json(atividade);
    }
}