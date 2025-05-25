"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RelatorioController_1 = require("../controllers/RelatorioController");
const RelatorioService_1 = require("../../application/services/RelatorioService");
const router = (0, express_1.Router)();
const relatorioService = new RelatorioService_1.RelatorioService();
const relatorioController = new RelatorioController_1.RelatorioController(relatorioService);
router.get('/relatorios/atividades/montadora', (req, res) => relatorioController.atividadesPorMontadora(req, res));
router.get('/relatorios/atividades/vendedor', (req, res) => relatorioController.atividadesPorVendedor(req, res));
router.get('/relatorios/atividades/loja', (req, res) => relatorioController.atividadesPorLoja(req, res));
router.get('/relatorios/atividades/equipe', (req, res) => relatorioController.atividadesPorEquipe(req, res));
exports.default = router;
//# sourceMappingURL=relatorioRoutes.js.map