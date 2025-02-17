import { Request, Response } from "express";
import { CriarMeta } from "../../application/use-cases/CriarMeta";

export class MetaController {
    constructor(private criarMeta: CriarMeta) {}

    async criar(req: Request, res: Response) {
        try {
            console.log("📥 Dados recebidos no body:", req.body);
            
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }

            const { id, equipeId, objetivo } = req.body;

            // Validação dos campos obrigatórios
            if (!id || !equipeId || objetivo === undefined) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        equipeId: equipeId ? 'presente' : 'ausente',
                        objetivo: objetivo !== undefined ? 'presente' : 'ausente'
                    }
                });
            }

            console.log("✨ Dados extraídos:", { id, equipeId, objetivo });

            const meta = await this.criarMeta.executar({ id, equipeId, objetivo });
            console.log("✅ Meta criada com sucesso:", meta);
            
            return res.status(201).json(meta);
        } catch (erro) {
            console.error("❌ Erro ao criar meta:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao criar meta',
                mensagem: (erro as Error).message 
            });
        }
    }
}