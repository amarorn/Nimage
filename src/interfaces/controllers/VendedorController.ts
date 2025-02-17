import { Request, Response } from "express";
import { CriarVendedor } from "../../application/use-cases/CriarVendedor";

export class VendedorController {
    constructor(private criarVendedor: CriarVendedor) {}

    async criar(req: Request, res: Response) {
        try {
            console.log("📥 Dados recebidos no body:", req.body);
            
            // Validação dos dados de entrada
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }

            const { id, nome, equipe } = req.body;

            // Validação dos campos obrigatórios
            if (!id || !nome || !equipe) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        nome: nome ? 'presente' : 'ausente',
                        equipe: equipe ? 'presente' : 'ausente'
                    }
                });
            }

            console.log("✨ Dados extraídos:", { id, nome, equipe });

            const vendedor = await this.criarVendedor.executar({ id, nome, equipe });
            console.log("✅ Vendedor criado com sucesso:", vendedor);
            
            return res.status(201).json(vendedor);
        } catch (erro) {
            console.error("❌ Erro ao criar vendedor:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao criar vendedor',
                mensagem: (erro as Error).message 
            });
        }
    }
}