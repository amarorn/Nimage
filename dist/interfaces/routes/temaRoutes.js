"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TemaRepositoryImpl_1 = require("../../infrastructure/repositories/TemaRepositoryImpl");
const CriarTema_1 = require("../../application/use-cases/CriarTema");
const ObterTema_1 = require("../../application/use-cases/ObterTema");
const AtualizarTema_1 = require("../../application/use-cases/AtualizarTema");
const TemaController_1 = require("../controllers/TemaController");
const router = (0, express_1.Router)();
// Instanciando o repositório e casos de uso
const temaRepo = new TemaRepositoryImpl_1.TemaRepositoryImpl();
const criarTema = new CriarTema_1.CriarTema(temaRepo);
const obterTema = new ObterTema_1.ObterTema(temaRepo);
const atualizarTema = new AtualizarTema_1.AtualizarTema(temaRepo);
// Instanciando o controller
const temaController = new TemaController_1.TemaController(criarTema, obterTema, atualizarTema, temaRepo);
// Rotas
router.post("/temas", async (req, res) => {
    return temaController.criar(req, res);
});
router.get("/temas", async (req, res) => {
    return temaController.obterTodos(req, res);
});
router.get("/temas/:id", async (req, res) => {
    return temaController.obterPorId(req, res);
});
router.put("/temas/:id", async (req, res) => {
    return temaController.atualizar(req, res);
});
router.delete("/temas/:id", async (req, res) => {
    return temaController.deletar(req, res);
});
exports.default = router;
//# sourceMappingURL=temaRoutes.js.map