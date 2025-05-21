import { Request, Response } from "express";
import { CriarEquipe } from "../../application/use-cases/CriarEquipe";
import { ObterEquipe } from "../../application/use-cases/ObterEquipe";
import { ObterEquipeDadosFull } from "../../application/use-cases/ObterEquipeDadosFull";
import { EquipeMetaService } from "../../application/services/EquipeMetaService";
import { AtualizarEquipe } from "../../application/use-cases/AtualizarEquipe";
import { Equipe } from "../../domain/entities/Equipe";

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
                nome, 
                pdv, 
                cidade, 
                estado, 
                gerenteNome, 
                gerenteTelefone, 
                capitaoNome, 
                capitaoTelefone,
                temaId 
            } = req.body;

            // Validação dos campos obrigatórios
            if (!nome || !pdv || !cidade || !estado) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        nome: nome ? 'presente' : 'ausente',
                        pdv: pdv ? 'presente' : 'ausente',
                        cidade: cidade ? 'presente' : 'ausente',
                        estado: estado ? 'presente' : 'ausente'
                    }
                });
            }

            const equipe = await this.criarEquipe.executar({ 
                nome, 
                pdv, 
                cidade, 
                estado, 
                gerenteNome, 
                gerenteTelefone, 
                capitaoNome, 
                capitaoTelefone,
                temaId 
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

            console.log('🔍 Buscando equipes - Página:', page, 'Limite:', limit);

            const equipes = await this.obterEquipe.executar(skip, limit);
            
            if (!equipes || equipes.length === 0) {
                console.log('⚠️ Nenhuma equipe encontrada no banco');
                return res.status(200).json({
                    pagina: page,
                    limite: limit,
                    total: 0,
                    equipes: []
                });
            }

            console.log(`✅ ${equipes.length} equipes encontradas no banco`);

            return res.status(200).json({
                pagina: page,
                limite: limit,
                total: equipes.length,
                equipes: equipes.map((equipe: Equipe) => ({
                    id: equipe.id,
                    nome: equipe.nome,
                    pdv: equipe.pdv,
                    cidade: equipe.cidade,
                    estado: equipe.estado,
                    gerenteNome: equipe.gerenteNome,
                    gerenteTelefone: equipe.gerenteTelefone,
                    capitaoNome: equipe.capitaoNome,
                    capitaoTelefone: equipe.capitaoTelefone,
                    temaId: equipe.temaId
                }))
            });
        } catch (erro) {
            console.error('❌ Erro ao obter equipes:', erro);
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
                pdv: equipe.pdv,
                cidade: equipe.cidade,
                estado: equipe.estado,
                gerenteNome: equipe.gerenteNome,
                gerenteTelefone: equipe.gerenteTelefone,
                capitaoNome: equipe.capitaoNome,
                capitaoTelefone: equipe.capitaoTelefone,
                temaId: equipe.temaId
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
            const { equipeId } = req.params;
            
            const dadosCompletos = await this.obterEquipeDadosFull.executar(equipeId);

            return res.status(200).json({
                status: 'success',
                data: dadosCompletos
            });
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao obter dados completos da equipe',
                mensagem: (erro as Error).message 
            });
        }
    }

    async calcularMeta(req: Request, res: Response) {
        try {
            const { equipeId } = req.params;

            const resultado = await this.equipeMetaService.calcularMeta(equipeId);

            return res.status(200).json({
                status: 'success',
                data: resultado
            });
        } catch (erro) {
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
                pdv, 
                cidade, 
                estado, 
                gerenteNome, 
                gerenteTelefone, 
                capitaoNome, 
                capitaoTelefone,
                temaId 
            } = req.body;

            // Validação dos campos
            const camposAtualizacao = {
                nome,
                pdv,
                cidade,
                estado,
                gerenteNome,
                gerenteTelefone,
                capitaoNome,
                capitaoTelefone,
                temaId
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
                pdv: equipeAtualizada.pdv,
                cidade: equipeAtualizada.cidade,
                estado: equipeAtualizada.estado,
                gerenteNome: equipeAtualizada.gerenteNome,
                gerenteTelefone: equipeAtualizada.gerenteTelefone,
                capitaoNome: equipeAtualizada.capitaoNome,
                capitaoTelefone: equipeAtualizada.capitaoTelefone,
                temaId: equipeAtualizada.temaId
            });
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao atualizar equipe',
                mensagem: (erro as Error).message 
            });
        }
    }
}