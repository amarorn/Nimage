import { Request, Response } from "express";
import { CriarEquipe } from "../../application/use-cases/CriarEquipe";
import { ObterEquipe } from "../../application/use-cases/ObterEquipe";
import { ObterEquipeDadosFull } from "../../application/use-cases/ObterEquipeDadosFull";
import { EquipeMetaService } from "../../application/services/EquipeMetaService";
import { AtualizarEquipe } from "../../application/use-cases/AtualizarEquipe";

export class EquipeController {
    constructor(
        private criarEquipe: CriarEquipe, 
        private obterEquipe: ObterEquipe,
        private obterEquipeDadosFull: ObterEquipeDadosFull,
        private equipeMetaService: EquipeMetaService,
        private atualizarEquipe: AtualizarEquipe
    ) {}

    async criar(req: Request, res: Response) {
        try {
            // //console.log("📥 Dados recebidos no body:", req.body);
            
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

            // //console.log("✨ Dados extraídos:", { id, nome });

            const equipe = await this.criarEquipe.executar({ id, nome });
            // //console.log("✅ Equipe criada com sucesso:", equipe);
            
            return res.status(201).json(equipe);
        } catch (erro) {
            // console.error("❌ Erro ao criar equipe:", erro);
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
            // //console.log("✅ Equipes obtidas com sucesso:", equipes);

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
            // console.error("❌ Erro ao obter equipes:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter equipes',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const equipe = await this.obterEquipe.executarPorId(id);
            // //console.log("✅ Equipe obtida com sucesso:", equipe);

            if (!equipe) {
                return res.status(404).json({ erro: 'Equipe não encontrada' });
            }

            return res.status(200).json(equipe);
        } catch (erro) {
            // console.error("❌ Erro ao obter equipe:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter equipe',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterDadosFull(req: Request, res: Response) {
        try {
            // //console.log("🔍 Recebendo requisição para obter dados completos da equipe", req.params);
            const { equipeId } = req.params;
            
            const dadosCompletos = await this.obterEquipeDadosFull.executar(equipeId);
            // //console.log("✅ Dados completos obtidos com sucesso");

            return res.status(200).json({
                status: 'success',
                data: dadosCompletos
            });
        } catch (erro) {
            // console.error("❌ Erro ao obter dados completos da equipe:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter dados completos da equipe',
                mensagem: (erro as Error).message 
            });
        }
    }

    async calcularMeta(req: Request, res: Response) {
        try {
            const { equipeId } = req.params;
            // //console.log("🔍 Calculando meta para equipe ID:", equipeId);

            const resultado = await this.equipeMetaService.calcularMeta(equipeId);
            // //console.log("✅ Resultado do cálculo de meta:", resultado);

            return res.status(200).json({
                status: 'success',
                data: resultado
            });
        } catch (erro) {
            // console.error("❌ Erro ao calcular meta:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao calcular meta',
                mensagem: (erro as Error).message 
            });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            // //console.log("📥 Dados recebidos para atualização:", req.body);
            const { id } = req.params;
            const { nome } = req.body;

            // Validação dos campos obrigatórios
            if (!nome) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        nome: nome ? 'presente' : 'ausente'
                    }
                });
            }

            const equipeAtualizada = await this.atualizarEquipe.executar(id, { nome });
            // //console.log("✅ Equipe atualizada com sucesso:", equipeAtualizada);

            return res.status(200).json(equipeAtualizada);
        } catch (erro) {
            // console.error("❌ Erro ao atualizar equipe:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao atualizar equipe',
                mensagem: (erro as Error).message 
            });
        }
    }
}