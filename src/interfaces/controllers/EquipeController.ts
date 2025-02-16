import { Request, Response } from "express";
import { CriarEquipe } from "../../application/use-cases/CriarEquipe";

export class EquipeController {
    constructor(private criarEquipe: CriarEquipe) {}

    async criar(req: Request, res: Response) {
        const { id, nome } = req.body;
        const equipe = await this.criarEquipe.executar({ id, nome });
        res.status(201).json(equipe);
    }
}