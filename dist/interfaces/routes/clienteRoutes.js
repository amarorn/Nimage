"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClienteController_1 = require("../controllers/ClienteController");
const CriarCliente_1 = require("../../application/use-cases/CriarCliente");
const AtualizarCliente_1 = require("../../application/use-cases/AtualizarCliente");
const ObterCliente_1 = require("../../application/use-cases/ObterCliente");
const DeletarCliente_1 = require("../../application/use-cases/DeletarCliente");
const ClienteRepositoryImpl_1 = require("../../infrastructure/database/repositories/ClienteRepositoryImpl");
const router = (0, express_1.Router)();
// Inicializa as dependências
const clienteRepository = new ClienteRepositoryImpl_1.ClienteRepositoryImpl();
const criarCliente = new CriarCliente_1.CriarCliente(clienteRepository);
const atualizarCliente = new AtualizarCliente_1.AtualizarCliente(clienteRepository);
const obterCliente = new ObterCliente_1.ObterCliente(clienteRepository);
const deletarCliente = new DeletarCliente_1.DeletarCliente(clienteRepository);
// Inicializa o controller
const clienteController = new ClienteController_1.ClienteController(criarCliente, atualizarCliente, obterCliente, deletarCliente);
// Define as rotas
router.post('/', (req, res) => clienteController.criar(req, res));
router.get('/', (req, res) => clienteController.obterTodos(req, res));
router.get('/:id', (req, res) => clienteController.obterPorId(req, res));
router.get('/vendedor/:vendedorId', (req, res) => clienteController.obterPorVendedor(req, res));
router.put('/:id', (req, res) => clienteController.atualizar(req, res));
router.delete('/:id', (req, res) => clienteController.deletar(req, res));
exports.default = router;
//# sourceMappingURL=clienteRoutes.js.map