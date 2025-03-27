"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CategoriaRepositoryImpl_1 = require("../../infrastructure/repositories/CategoriaRepositoryImpl");
const CriarCategoria_1 = require("../../application/use-cases/CriarCategoria");
const ObterCategoria_1 = require("../../application/use-cases/ObterCategoria");
const AtualizarCategoria_1 = require("../../application/use-cases/AtualizarCategoria");
const CategoriaController_1 = require("../controllers/CategoriaController");
const router = (0, express_1.Router)();
// Instanciando o repositório e casos de uso
const categoriaRepo = new CategoriaRepositoryImpl_1.CategoriaRepositoryImpl();
const criarCategoria = new CriarCategoria_1.CriarCategoria(categoriaRepo);
const obterCategoria = new ObterCategoria_1.ObterCategoria(categoriaRepo);
const atualizarCategoria = new AtualizarCategoria_1.AtualizarCategoria(categoriaRepo);
// Instanciando o controller
const categoriaController = new CategoriaController_1.CategoriaController(criarCategoria, obterCategoria, atualizarCategoria, categoriaRepo);
// Rotas
router.post("/categorias", async (req, res) => {
    return categoriaController.criar(req, res);
});
router.get("/categorias/all", async (req, res) => {
    return categoriaController.obterTodos(req, res);
});
router.get("/categorias/:id", async (req, res) => {
    return categoriaController.obterPorId(req, res);
});
router.put("/categorias/:id", async (req, res) => {
    return categoriaController.atualizar(req, res);
});
router.delete("/categorias/:id", async (req, res) => {
    return categoriaController.deletar(req, res);
});
exports.default = router;
//# sourceMappingURL=categoriaRoutes.js.map