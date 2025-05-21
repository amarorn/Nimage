import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';
import { CriarCliente } from '../../application/use-cases/CriarCliente';
import { AtualizarCliente } from '../../application/use-cases/AtualizarCliente';
import { ObterCliente } from '../../application/use-cases/ObterCliente';
import { DeletarCliente } from '../../application/use-cases/DeletarCliente';
import { ClienteRepositoryImpl } from '../../infrastructure/database/repositories/ClienteRepositoryImpl';

const router = Router();

// Inicializa as dependências
const clienteRepository = new ClienteRepositoryImpl();
const criarCliente = new CriarCliente(clienteRepository);
const atualizarCliente = new AtualizarCliente(clienteRepository);
const obterCliente = new ObterCliente(clienteRepository);
const deletarCliente = new DeletarCliente(clienteRepository);

// Inicializa o controller
const clienteController = new ClienteController(
    criarCliente,
    atualizarCliente,
    obterCliente,
    deletarCliente
);

// Define as rotas
router.post('/', (req, res) => clienteController.criar(req, res));
router.get('/', (req, res) => clienteController.obterTodos(req, res));
router.get('/:id', (req, res) => clienteController.obterPorId(req, res));
router.get('/vendedor/:vendedorId', (req, res) => clienteController.obterPorVendedor(req, res));
router.put('/:id', (req, res) => clienteController.atualizar(req, res));
router.delete('/:id', (req, res) => clienteController.deletar(req, res));

export default router; 