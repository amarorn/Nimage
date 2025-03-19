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
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }

            const { 
                id, 
                nome, 
                nomepdv, 
                cidade, 
                estado, 
                gerente, 
                contato_gerente, 
                capitao, 
                contato_capitao 
            } = req.body;

            // Validação dos campos obrigatórios
            if (!id || !nome || !nomepdv || !cidade || !estado || 
                !gerente || !contato_gerente || !capitao || !contato_capitao) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        nome: nome ? 'presente' : 'ausente',
                        nomepdv: nomepdv ? 'presente' : 'ausente',
                        cidade: cidade ? 'presente' : 'ausente',
                        estado: estado ? 'presente' : 'ausente',
                        gerente: gerente ? 'presente' : 'ausente',
                        contato_gerente: contato_gerente ? 'presente' : 'ausente',
                        capitao: capitao ? 'presente' : 'ausente',
                        contato_capitao: contato_capitao ? 'presente' : 'ausente'
                    }
                });
            }

            const equipe = await this.criarEquipe.executar({ 
                id, 
                nome, 
                nomepdv, 
                cidade, 
                estado, 
                gerente, 
                contato_gerente, 
                capitao, 
                contato_capitao 
            });
            return res.status(201).json(equipe);
        } catch (erro) {
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

            const respostaPersonalizada = {
                pagina: page,
                limite: limit,
                total: equipes.length,
                equipes: equipes.map(equipe => ({
                    id: equipe.id,
                    nome: equipe.nome,
                    nomepdv: equipe.nomepdv,
                    cidade: equipe.cidade,
                    estado: equipe.estado,
                    gerente: equipe.gerente,
                    contato_gerente: equipe.contato_gerente,
                    capitao: equipe.capitao,
                    contato_capitao: equipe.contato_capitao
                }))
            };

            return respostaPersonalizada;
        } catch (erro) {
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

            if (!equipe) {
                return res.status(404).json({ erro: 'Equipe não encontrada' });
            }

            return res.status(200).json({
                id: equipe.id,
                nome: equipe.nome,
                nomepdv: equipe.nomepdv,
                cidade: equipe.cidade,
                estado: equipe.estado,
                gerente: equipe.gerente,
                contato_gerente: equipe.contato_gerente,
                capitao: equipe.capitao,
                contato_capitao: equipe.contato_capitao
            });
        } catch (erro) {
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
            const { id } = req.params;
            const { 
                nome,
                nomepdv,
                cidade,
                estado,
                gerente,
                contato_gerente,
                capitao,
                contato_capitao
            } = req.body;

            // Validação dos campos
            const camposAtualizacao = {
                nome,
                nomepdv,
                cidade,
                estado,
                gerente,
                contato_gerente,
                capitao,
                contato_capitao
            };

            // Filtra apenas os campos que foram fornecidos
            const dadosAtualizacao = Object.entries(camposAtualizacao)
                .filter(([_, valor]) => valor !== undefined)
                .reduce((acc, [chave, valor]) => ({
                    ...acc,
                    [chave]: valor
                }), {});

            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(400).json({
                    erro: 'Nenhum campo válido para atualização foi fornecido'
                });
            }

            const equipeAtualizada = await this.atualizarEquipe.executar(id, dadosAtualizacao);

            if (!equipeAtualizada) {
                return res.status(404).json({ erro: 'Equipe não encontrada' });
            }

            return res.status(200).json({
                id: equipeAtualizada.id,
                nome: equipeAtualizada.nome,
                nomepdv: equipeAtualizada.nomepdv,
                cidade: equipeAtualizada.cidade,
                estado: equipeAtualizada.estado,
                gerente: equipeAtualizada.gerente,
                contato_gerente: equipeAtualizada.contato_gerente,
                capitao: equipeAtualizada.capitao,
                contato_capitao: equipeAtualizada.contato_capitao
            });
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao atualizar equipe',
                mensagem: (erro as Error).message 
            });
        }
    }
}