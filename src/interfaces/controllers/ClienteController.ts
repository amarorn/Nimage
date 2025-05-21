import { Request, Response } from 'express';
import { CriarCliente } from '../../application/use-cases/CriarCliente';
import { AtualizarCliente } from '../../application/use-cases/AtualizarCliente';
import { ObterCliente } from '../../application/use-cases/ObterCliente';
import { DeletarCliente } from '../../application/use-cases/DeletarCliente';
import { ClienteCacheService } from '../../infrastructure/cache/ClienteCacheService';
import { v4 as uuidv4 } from 'uuid';

export class ClienteController {
    private cacheService: ClienteCacheService;

    constructor(
        private criarCliente: CriarCliente,
        private atualizarCliente: AtualizarCliente,
        private obterCliente: ObterCliente,
        private deletarCliente: DeletarCliente
    ) {
        this.cacheService = ClienteCacheService.getInstance();
    }

    async criar(req: Request, res: Response) {
        try {
            const id = uuidv4();
            const cliente = await this.criarCliente.executar({ id, ...req.body });
            await this.cacheService.invalidateAll();
            res.status(201).json(cliente);
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao criar cliente' });
        }
    }

    async obterTodos(req: Request, res: Response) {
        try {
            const pagina = parseInt(req.query.pagina as string) || 1;
            const limite = parseInt(req.query.limite as string) || 10;

            const cacheKey = `clientes:${pagina}:${limite}`;
            const cachedData = await this.cacheService.get(cacheKey);

            if (cachedData) {
                return res.json(cachedData);
            }

            const resultado = await this.obterCliente.executar({ pagina, limite });
            await this.cacheService.set(cacheKey, resultado);
            res.json(resultado);
        } catch (error) {
            console.error('Erro ao obter clientes:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter clientes' });
        }
    }

    async obterPorId(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const cacheKey = `cliente:${id}`;
            const cachedCliente = await this.cacheService.get(cacheKey);

            if (cachedCliente) {
                return res.json(cachedCliente);
            }

            const cliente = await this.obterCliente.executarPorId(id);
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            await this.cacheService.set(cacheKey, cliente);
            res.json(cliente);
        } catch (error) {
            console.error('Erro ao obter cliente:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter cliente' });
        }
    }

    async obterPorVendedor(req: Request, res: Response) {
        try {
            const { vendedorId } = req.params;
            const cacheKey = `clientes:vendedor:${vendedorId}`;
            const cachedClientes = await this.cacheService.get(cacheKey);

            if (cachedClientes) {
                return res.json(cachedClientes);
            }

            const clientes = await this.obterCliente.executarPorVendedorId(vendedorId);
            await this.cacheService.set(cacheKey, clientes);
            res.json(clientes);
        } catch (error) {
            console.error('Erro ao obter clientes do vendedor:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter clientes do vendedor' });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const cliente = await this.atualizarCliente.executar(id, req.body);
            await this.cacheService.invalidateAll();
            await this.cacheService.delete(`cliente:${id}`);
            res.json(cliente);
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao atualizar cliente' });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.deletarCliente.executar(id);
            await this.cacheService.invalidateAll();
            await this.cacheService.delete(`cliente:${id}`);
            res.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao deletar cliente' });
        }
    }
} 