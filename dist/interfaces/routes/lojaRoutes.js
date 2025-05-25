"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LojaController_1 = require("../controllers/LojaController");
const CriarLoja_1 = require("../../application/use-cases/CriarLoja");
const AtualizarLoja_1 = require("../../application/use-cases/AtualizarLoja");
const ObterLoja_1 = require("../../application/use-cases/ObterLoja");
const DeletarLoja_1 = require("../../application/use-cases/DeletarLoja");
const LojaRepositoryImpl_1 = require("../../infrastructure/repositories/LojaRepositoryImpl");
const router = (0, express_1.Router)();
// Inicializa as dependências
const lojaRepository = new LojaRepositoryImpl_1.LojaRepositoryImpl();
const criarLoja = new CriarLoja_1.CriarLoja(lojaRepository);
const atualizarLoja = new AtualizarLoja_1.AtualizarLoja(lojaRepository);
const obterLoja = new ObterLoja_1.ObterLoja(lojaRepository);
const deletarLoja = new DeletarLoja_1.DeletarLoja(lojaRepository);
// Inicializa o controller
const lojaController = new LojaController_1.LojaController(criarLoja, atualizarLoja, obterLoja, deletarLoja);
// Define as rotas
router.post('/', (req, res) => lojaController.criar(req, res));
router.get('/', (req, res) => lojaController.obterTodos(req, res));
router.get('/:id', (req, res) => lojaController.obterPorId(req, res));
router.put('/:id', (req, res) => lojaController.atualizar(req, res));
router.delete('/:id', (req, res) => lojaController.deletar(req, res));
exports.default = router;
//# sourceMappingURL=lojaRoutes.js.map