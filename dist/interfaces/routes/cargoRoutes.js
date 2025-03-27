"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CargoRepositoryImpl_1 = require("../../infrastructure/repositories/CargoRepositoryImpl");
const CriarCargo_1 = require("../../application/use-cases/CriarCargo");
const ObterCargo_1 = require("../../application/use-cases/ObterCargo");
const AtualizarCargo_1 = require("../../application/use-cases/AtualizarCargo");
const CargoController_1 = require("../controllers/CargoController");
const router = (0, express_1.Router)();
// Instanciando o repositório e casos de uso
const cargoRepo = new CargoRepositoryImpl_1.CargoRepositoryImpl();
const criarCargo = new CriarCargo_1.CriarCargo(cargoRepo);
const obterCargo = new ObterCargo_1.ObterCargo(cargoRepo);
const atualizarCargo = new AtualizarCargo_1.AtualizarCargo(cargoRepo);
// Instanciando o controller
const cargoController = new CargoController_1.CargoController(criarCargo, obterCargo, atualizarCargo, cargoRepo);
// Rotas
router.post("/cargos", async (req, res) => {
    return cargoController.criar(req, res);
});
router.get("/cargos/all", async (req, res) => {
    return cargoController.obterTodos(req, res);
});
router.get("/cargos/:id", async (req, res) => {
    return cargoController.obterPorId(req, res);
});
router.put("/cargos/:id", async (req, res) => {
    return cargoController.atualizar(req, res);
});
router.delete("/cargos/:id", async (req, res) => {
    return cargoController.deletar(req, res);
});
exports.default = router;
//# sourceMappingURL=cargoRoutes.js.map