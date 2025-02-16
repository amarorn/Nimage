import { Request, Response } from "express";
import { CriarVendedor } from "../../application/use-cases/CriarVendedor";

export class VendedorController {
    constructor(private criarVendedor: CriarVendedor) {}

    async criar(req: Request, res: Response) {
        const { id, nome, equipe } = req.body;
        const vendedor = await this.criarVendedor.executar({ id, nome, equipe });
        res.status(201).json(vendedor);
    }
}