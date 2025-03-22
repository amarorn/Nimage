"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const CriarEquipe_1 = require("../../application/use-cases/CriarEquipe");
const EquipeController_1 = require("../controllers/EquipeController");
const ObterEquipe_1 = require("../../application/use-cases/ObterEquipe");
const ObterEquipeDadosFull_1 = require("../../application/use-cases/ObterEquipeDadosFull");
const EquipeMetaService_1 = require("../../application/services/EquipeMetaService");
const AtualizarEquipe_1 = require("../../application/use-cases/AtualizarEquipe");
const router = (0, express_1.Router)();
const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
const criarEquipe = new CriarEquipe_1.CriarEquipe(equipeRepo);
const obterEquipe = new ObterEquipe_1.ObterEquipe(equipeRepo);
const atualizar = new AtualizarEquipe_1.AtualizarEquipe(equipeRepo);
const obterEquipeDadosFull = new ObterEquipeDadosFull_1.ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
const equipeMetaService = new EquipeMetaService_1.EquipeMetaService(obterEquipeDadosFull);
const equipeController = new EquipeController_1.EquipeController(criarEquipe, obterEquipe, obterEquipeDadosFull, equipeMetaService, atualizar);
router.post("/equipes", async (req, res) => {
    //console.log("📨 Nova requisição POST /equipes");
    return equipeController.criar(req, res);
});
router.get("/equipes/all", async (req, res) => {
    //console.log("📨 Nova requisição GET /equipes");
    const equipes = await equipeController.obterTodos(req, res);
    return res.json(equipes);
});
router.get("/equipes/:id", async (req, res) => {
    //console.log("📨 Nova requisição GET /equipes/:id");
    return equipeController.obterPorId(req, res);
});
router.get("/equipes/:equipeId/dados-full", async (req, res) => {
    //console.log("📨 Nova requisição GET /equipes/:equipeId/dados-full");
    return equipeController.obterDadosFull(req, res);
});
// Nova rota para calcular a meta
router.get("/equipes/:equipeId/calcular-meta", async (req, res) => {
    //console.log("📨 Nova requisição GET /equipes/:equipeId/calcular-meta");
    return equipeController.calcularMeta(req, res);
});
router.put("/equipes/:id", async (req, res) => {
    //console.log("📨 Nova requisição PUT /equipes/:id");
    return equipeController.atualizar(req, res);
});
exports.default = router;
//# sourceMappingURL=equipeRoutes.js.map