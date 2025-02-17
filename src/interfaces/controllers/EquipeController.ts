import { Request, Response } from "express";
import { CriarEquipe } from "../../application/use-cases/CriarEquipe";

export class EquipeController {
    constructor(private criarEquipe: CriarEquipe) {}

    async criar(req: Request, res: Response) {
        try {
            console.log("📥 Dados recebidos no body:", req.body);
            
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }

            const { id, nome } = req.body;

            // Validação dos campos obrigatórios
            if (!id || !nome) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        nome: nome ? 'presente' : 'ausente'
                    }
                });
            }

            console.log("✨ Dados extraídos:", { id, nome });

            const equipe = await this.criarEquipe.executar({ id, nome });
            console.log("✅ Equipe criada com sucesso:", equipe);
            
            return res.status(201).json(equipe);
        } catch (erro) {
            console.error("❌ Erro ao criar equipe:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao criar equipe',
                mensagem: (erro as Error).message 
            });
        }
    }
}