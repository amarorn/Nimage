import { Request, Response } from "express";
import { CriarMeta } from "../../application/use-cases/CriarMeta"

export class MetaController {
    constructor(private criarMeta: CriarMeta) {}

    async criar(req: Request, res: Response) {
        const { id, equipeId, objetivo } = req.body;
        const meta = await this.criarMeta.executar({ id, equipeId, objetivo });
        res.status(201).json(meta);
    }
}