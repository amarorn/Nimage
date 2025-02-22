import { Request, Response } from "express";
import { CriarVendedor } from "../../application/use-cases/CriarVendedor";
import { ObterVendedor } from "../../application/use-cases/ObterVendedor";
import { AtualizarVendedor } from "../../application/use-cases/AtualizarVendedor";

export class VendedorController {
    constructor(
        private criarVendedor: CriarVendedor,
        private obterVendedor: ObterVendedor,
        private atualizarVendedor: AtualizarVendedor
    ) {}

    async criar(req: Request, res: Response) {
        try {
            // //console.log("📥 Dados recebidos no body:", req.body);
            
            // Validação dos dados de entrada
            if (!req.body) {
                return res.status(400).json({ erro: 'Body da requisição está vazio' });
            }

            const { id, nome, equipe_id } = req.body;

            // Validação dos campos obrigatórios
            if (!id || !nome || !equipe_id) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        id: id ? 'presente' : 'ausente',
                        nome: nome ? 'presente' : 'ausente',
                        equipe_id: equipe_id ? 'presente' : 'ausente'
                    }
                });
            }

            // //console.log("✨ Dados extraídos:", { id, nome, equipe_id });

            const vendedor = await this.criarVendedor.executar({ id, nome, equipe_id });
            // //console.log("✅ Vendedor criado com sucesso:", vendedor);
            
            return res.status(201).json(vendedor);
        } catch (erro) {
            // console.error("❌ Erro ao criar vendedor:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao criar vendedor',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterTodos(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;

            const vendedores = await this.obterVendedor.executar(skip, limit);
            // //console.log("✅ Vendedores obtidos com sucesso:", vendedores);

            // Criar uma resposta personalizada com paginação
            const respostaPersonalizada = {
                pagina: page,
                limite: limit,
                total: vendedores.length,
                vendedores: vendedores.map(vendedor => ({
                    id: vendedor.id,
                    nome: vendedor.nome,
                    equipe_id: vendedor.equipe_id,
                    equipeDetalhes: vendedor.equipeDetalhes
                }))
            };

            return respostaPersonalizada;
        } catch (erro) {
            // console.error("❌ Erro ao obter vendedores:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter vendedores',
                mensagem: (erro as Error).message 
            });
        }
    }

    async obterPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const vendedor = await this.obterVendedor.executarPorId(id);
            // //console.log("✅ Vendedor obtido com sucesso:", vendedor);

            if (!vendedor) {
                return res.status(404).json({ erro: 'Vendedor não encontrado' });
            }

            return res.status(200).json({
                id: vendedor.id,
                nome: vendedor.nome,
                equipe_id: vendedor.equipe_id,
                equipeDetalhes: vendedor.equipeDetalhes
            });
        } catch (erro) {
            // console.error("❌ Erro ao obter vendedor:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao obter vendedor',
                mensagem: (erro as Error).message 
            });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            // //console.log("📥 Dados recebidos para atualização:", req.body);
            const { id } = req.params;
            const { nome, equipe_id } = req.body;

            // Validação dos campos obrigatórios
            if (!nome || !equipe_id) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        nome: nome ? 'presente' : 'ausente',
                        equipe_id: equipe_id ? 'presente' : 'ausente'
                    }
                });
            }

            const vendedorAtualizado = await this.atualizarVendedor.executar(id, { nome, equipe_id });
            // //console.log("✅ Vendedor atualizado com sucesso:", vendedorAtualizado);

            return res.status(200).json(vendedorAtualizado);
        } catch (erro) {
            // console.error("❌ Erro ao atualizar vendedor:", erro);
            return res.status(500).json({ 
                erro: 'Erro interno ao atualizar vendedor',
                mensagem: (erro as Error).message 
            });
        }
    }
}