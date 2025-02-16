import { Request, Response } from "express";
import { CriarVendedor } from "../../application/use-cases/CriarVendedor";

export class VendedorController {
    constructor(private criarVendedor: CriarVendedor) {}

    async criar(req: Request, res: Response) {
        const { id, nome, equipe } = req.body;
        console.log("Recebendo dados no Controller:", req.body);
        try {
            console.log("Executando o caso de uso");
            const vendedor = await this.criarVendedor.executar({ id, nome, equipe });
            res.status(201).json(vendedor);
        } catch (error) {
            console.error("Erro no Controller:", error);
            res.status(400).json({ error: error });
        }
    }
}