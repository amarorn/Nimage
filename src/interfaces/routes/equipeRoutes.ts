import { Router } from "express";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { CriarEquipe } from "../../application/use-cases/CriarEquipe";
import { EquipeController } from "../controllers/EquipeController";
import { ObterEquipe } from "../../application/use-cases/ObterEquipe";

const router = Router();
const equipeRepo = new EquipeRepositoryImpl();
const criarEquipe = new CriarEquipe(equipeRepo);
const obterEquipe = new ObterEquipe(equipeRepo);
const equipeController = new EquipeController(criarEquipe, obterEquipe);

router.post("/equipes", async (req, res) => {
    console.log("📨 Nova requisição POST /equipes");
    return equipeController.criar(req, res);
});

router.get("/equipes/all", async (req, res) => {
    console.log("📨 Nova requisição GET /equipes");
    const equipes = await equipeController.obterTodos(req, res);
    return res.json(equipes);
});

router.get("/equipes/:id", async (req, res) => {
    console.log("📨 Nova requisição GET /equipes/:id");
    return equipeController.obterPorId(req, res);
});

export default router;