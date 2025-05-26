"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MontadoraController_1 = require("../controllers/MontadoraController");
const CriarMontadora_1 = require("../../application/use-cases/CriarMontadora");
const ObterMontadora_1 = require("../../application/use-cases/ObterMontadora");
const AtualizarMontadora_1 = require("../../application/use-cases/AtualizarMontadora");
const DeletarMontadora_1 = require("../../application/use-cases/DeletarMontadora");
const MontadoraRepositoryImpl_1 = require("../../infrastructure/repositories/MontadoraRepositoryImpl");
const router = (0, express_1.Router)();
// Repositories
const montadoraRepository = new MontadoraRepositoryImpl_1.MontadoraRepositoryImpl();
// Use Cases
const criarMontadora = new CriarMontadora_1.CriarMontadora(montadoraRepository);
const obterMontadora = new ObterMontadora_1.ObterMontadora(montadoraRepository);
const atualizarMontadora = new AtualizarMontadora_1.AtualizarMontadora(montadoraRepository);
const deletarMontadora = new DeletarMontadora_1.DeletarMontadora(montadoraRepository);
// Controller
const montadoraController = new MontadoraController_1.MontadoraController(criarMontadora, obterMontadora, atualizarMontadora, deletarMontadora);
// Routes
router.post('/montadoras', (req, res) => montadoraController.criar(req, res));
router.get('/montadoras', (req, res) => montadoraController.obterTodos(req, res));
router.get('/montadoras/all', (req, res) => montadoraController.obterTodosCompleto(req, res));
router.get('/montadoras/:id', (req, res) => montadoraController.obterPorId(req, res));
router.put('/montadoras/:id', (req, res) => montadoraController.atualizar(req, res));
router.delete('/montadoras/:id', (req, res) => montadoraController.deletar(req, res));
exports.default = router;
//# sourceMappingURL=montadoraRoutes.js.map