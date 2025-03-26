import { Router } from "express";
import { CargoRepositoryImpl } from "../../infrastructure/repositories/CargoRepositoryImpl";
import { CriarCargo } from "../../application/use-cases/CriarCargo";
import { ObterCargo } from "../../application/use-cases/ObterCargo";
import { AtualizarCargo } from "../../application/use-cases/AtualizarCargo";
import { CargoController } from "../controllers/CargoController";

const router = Router();

// Instanciando o repositório e casos de uso
const cargoRepo = new CargoRepositoryImpl();
const criarCargo = new CriarCargo(cargoRepo);
const obterCargo = new ObterCargo(cargoRepo);
const atualizarCargo = new AtualizarCargo(cargoRepo);

// Instanciando o controller
const cargoController = new CargoController(criarCargo, obterCargo, atualizarCargo, cargoRepo);

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

export default router; 