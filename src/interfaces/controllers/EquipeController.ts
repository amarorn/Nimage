import { Request, Response } from "express";
import { CriarEquipe } from "../../application/use-cases/CriarEquipe";
import { ObterEquipe } from "../../application/use-cases/ObterEquipe";

export class EquipeController {
    constructor(private criarEquipe: CriarEquipe, private obterEquipe: ObterEquipe) {}

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

    async obterTodos(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const equipes = await this.obterEquipe.executar(skip, limit);
            console.log("✅ Equipes obtidas com sucesso:", equipes);

            // Criar uma resposta personalizada com paginação
            const respostaPersonalizada = {
                pagina: page,
                limite: limit,
                total: equipes.length,
                equipes: equipes.map(equipe => ({
                    id: equipe.id,
                    nome: equipe.nome
                }))
            };

            return respostaPersonalizada;
        } catch (erro) {
            console.error("❌ Erro ao obter equipes:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter equipes',
                mensagem: (erro as Error).message 
            });
        }
    }
}