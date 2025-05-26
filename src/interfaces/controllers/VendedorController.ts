import { Request, Response } from "express";
import { CriarVendedor } from "../../application/use-cases/CriarVendedor";
import { ObterVendedor } from "../../application/use-cases/ObterVendedor";
import { AtualizarVendedor } from "../../application/use-cases/AtualizarVendedor";
import { GetVendedorInsights } from "../../application/use-cases/GetVendedorInsights";
import { VendedorCacheService } from "../../infrastructure/cache/VendedorCacheService";

export class VendedorController {
    private vendedorCache: VendedorCacheService;

    constructor(
        private criarVendedor: CriarVendedor,
        private obterVendedor: ObterVendedor,
        private atualizarVendedor: AtualizarVendedor,
        private getVendedorInsights: GetVendedorInsights
    ) {
        this.vendedorCache = VendedorCacheService.getInstance();
    }

    async criar(req: Request, res: Response) {
        try {
            const { nome, equipeId, email, telefone, meta, cargo } = req.body;

            // Validação dos campos obrigatórios
            const camposObrigatorios = {
                nome: nome,
                equipeId: equipeId,
                email: email,
                telefone: telefone,
                meta: meta,
                cargo: cargo
            };

            const camposAusentes = Object.entries(camposObrigatorios)
                .filter(([_, valor]) => !valor)
                .map(([campo]) => campo);

            const camposPresentes = Object.entries(camposObrigatorios)
                .filter(([_, valor]) => valor)
                .map(([campo]) => campo);

            if (camposAusentes.length > 0) {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: {
                        ...camposAusentes.reduce((acc, campo) => ({ ...acc, [campo]: 'ausente' }), {}),
                        ...camposPresentes.reduce((acc, campo) => ({ ...acc, [campo]: 'presente' }), {})
                    }
                });
            }

            const vendedor = await this.criarVendedor.executar({
                nome,
                equipeId,
                email,
                telefone,
                meta,
                cargo
            });

            // Invalida o cache após criar um novo vendedor
            await this.vendedorCache.invalidateAll();

            return res.status(201).json({ 
                mensagem: 'Vendedor criado com sucesso',
                vendedor: {
                    id: vendedor.id,
                    nome: vendedor.nome,
                    equipeId: vendedor.equipeId,
                    email: vendedor.email,
                    telefone: vendedor.telefone,
                    meta: vendedor.meta,
                    cargo: vendedor.cargo
                }
            });
        } catch (erro) {
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

            // Busca direto do banco de dados
            console.log('🔄 Buscando vendedores do banco');
            const vendedores = await this.obterVendedor.executar(skip, limit);

            return res.status(200).json({
                pagina: page,
                limite: limit,
                total: vendedores.length,
                vendedores: vendedores.map(vendedor => ({
                    id: vendedor.id,
                    nome: vendedor.nome,
                    equipeId: vendedor.equipeId,
                    email: vendedor.email,
                    telefone: vendedor.telefone,
                    meta: vendedor.meta,
                    cargo: vendedor.cargo
                }))
            });
        } catch (erro) {
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

            if (!vendedor) {
                return res.status(404).json({ erro: 'Vendedor não encontrado' });
            }

            return res.status(200).json({
                id: vendedor.id,
                nome: vendedor.nome,
                equipeId: vendedor.equipeId,
                email: vendedor.email,
                telefone: vendedor.telefone,
                meta: vendedor.meta,
                cargo: vendedor.cargo
            });
        } catch (erro) {
            return res.status(500).json({ 
                erro: 'Erro interno ao obter vendedor',
                mensagem: (erro as Error).message 
            });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, equipeId, email, telefone, meta, cargo } = req.body;

            const vendedorAtualizado = await this.atualizarVendedor.executar(id, {
                nome,
                equipeId,
                email,
                telefone,
                meta,
                cargo
            });

            if (!vendedorAtualizado) {
                return res.status(404).json({ erro: 'Vendedor não encontrado' });
            }

            // Invalida o cache após atualizar um vendedor
            await this.vendedorCache.invalidateAll();

            return res.status(200).json({
                id: vendedorAtualizado.id,
                nome: vendedorAtualizado.nome,
                equipeId: vendedorAtualizado.equipeId,
                email: vendedorAtualizado.email,
                telefone: vendedorAtualizado.telefone,
                meta: vendedorAtualizado.meta,
                cargo: vendedorAtualizado.cargo
            });
        } catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao atualizar vendedor',
                mensagem: (erro as Error).message
            });
        }
    }

    async obterInsights(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const insights = await this.getVendedorInsights.execute(id);
            return res.status(200).json(insights);
        } catch (erro) {
            return res.status(500).json({
                erro: 'Erro interno ao obter insights do vendedor',
                mensagem: (erro as Error).message
            });
        }
    }
}