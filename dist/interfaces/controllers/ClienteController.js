"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteController = void 0;
const ClienteCacheService_1 = require("../../infrastructure/cache/ClienteCacheService");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const csv_parse_1 = require("csv-parse");
class ClienteController {
    constructor(criarCliente, atualizarCliente, obterCliente, deletarCliente) {
        this.criarCliente = criarCliente;
        this.atualizarCliente = atualizarCliente;
        this.obterCliente = obterCliente;
        this.deletarCliente = deletarCliente;
        this.cacheService = ClienteCacheService_1.ClienteCacheService.getInstance();
    }
    /**
     * Cria um novo cliente.
     * Campos aceitos:
     * - nome (obrigatório)
     * - email (obrigatório)
     * - telefone (obrigatório)
     */
    async criar(req, res) {
        try {
            const id = (0, uuid_1.v4)();
            const { nome, email, telefone, vendedorId } = req.body;
            if (!nome || !email || !telefone) {
                return res.status(400).json({
                    error: 'Campos obrigatórios ausentes',
                    detalhes: { nome, email, telefone }
                });
            }
            const cliente = await this.criarCliente.executar({
                id,
                nome,
                email,
                telefone,
                vendedorId
            });
            await this.cacheService.invalidateAll();
            res.status(201).json(cliente);
        }
        catch (error) {
            console.error('Erro ao criar cliente:', error);
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao criar cliente' });
        }
    }
    async obterTodos(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;
            const cacheKey = `clientes:${pagina}:${limite}`;
            const cachedData = await this.cacheService.get(cacheKey);
            if (cachedData) {
                return res.json(cachedData);
            }
            const resultado = await this.obterCliente.executar({ pagina, limite });
            await this.cacheService.set(cacheKey, resultado);
            res.json(resultado);
        }
        catch (error) {
            console.error('Erro ao obter clientes:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter clientes' });
        }
    }
    async obterPorId(req, res) {
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
        }
        catch (error) {
            console.error('Erro ao obter cliente:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter cliente' });
        }
    }
    async obterPorVendedor(req, res) {
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
        }
        catch (error) {
            console.error('Erro ao obter clientes do vendedor:', error);
            res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao obter clientes do vendedor' });
        }
    }
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const cliente = await this.atualizarCliente.executar(id, req.body);
            await this.cacheService.invalidateAll();
            await this.cacheService.delete(`cliente:${id}`);
            res.json(cliente);
        }
        catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao atualizar cliente' });
        }
    }
    async deletar(req, res) {
        try {
            const { id } = req.params;
            await this.deletarCliente.executar(id);
            await this.cacheService.invalidateAll();
            await this.cacheService.delete(`cliente:${id}`);
            res.status(204).send();
        }
        catch (error) {
            console.error('Erro ao deletar cliente:', error);
            res.status(400).json({ error: error instanceof Error ? error.message : 'Erro ao deletar cliente' });
        }
    }
    async importarCSV(req, res) {
        if (!req.file) {
            return res.status(400).json({ error: 'Arquivo CSV não enviado' });
        }
        const clientes = [];
        const filePath = req.file.path;
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parse_1.parse)({ columns: true, delimiter: ',' }))
            .on('data', (row) => {
            clientes.push(row);
        })
            .on('end', async () => {
            try {
                for (const dados of clientes) {
                    await this.criarCliente.executar({
                        id: dados.id || (0, uuid_1.v4)(),
                        nome: dados.nome,
                        email: dados.email,
                        telefone: dados.telefone,
                        vendedorId: dados.vendedorId
                    });
                }
                fs_1.default.unlinkSync(filePath);
                res.status(201).json({ message: 'Clientes importados com sucesso', total: clientes.length });
            }
            catch (error) {
                res.status(500).json({ error: error instanceof Error ? error.message : 'Erro ao importar clientes' });
            }
        })
            .on('error', (error) => {
            res.status(500).json({ error: error.message });
        });
    }
}
exports.ClienteController = ClienteController;
//# sourceMappingURL=ClienteController.js.map