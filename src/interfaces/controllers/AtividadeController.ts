import { Request, Response } from "express";
import { CriarAtividade } from "../../application/use-cases/CriarAtividade";

export class AtividadeController {
    constructor(private criarAtividade: CriarAtividade) {}

    async criar(req: Request, res: Response) {
        try {
            console.log("📥 Dados recebidos no body:", req.body);
            
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }

            const { id, vendedorId, data, docinhosCoco } = req.body;

            // Validação dos campos obrigatórios
            if (!id || !vendedorId || !data || docinhosCoco === undefined) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        vendedorId: vendedorId ? 'presente' : 'ausente',
                        data: data ? 'presente' : 'ausente',
                        docinhosCoco: docinhosCoco !== undefined ? 'presente' : 'ausente'
                    }
                });
            }

            console.log("✨ Dados extraídos:", { id, vendedorId, data, docinhosCoco });

            const atividade = await this.criarAtividade.executar({ 
                id, 
                vendedorId, 
                data: new Date(data), 
                docinhosCoco 
            });
            
            console.log("✅ Atividade criada com sucesso:", atividade);
            return res.status(201).json(atividade);
        } catch (erro) {
            console.error("❌ Erro ao criar atividade:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao criar atividade',
                mensagem: (erro as Error).message 
            });
        }
    }
}