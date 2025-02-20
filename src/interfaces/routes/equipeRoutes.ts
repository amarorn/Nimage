import { Router } from "express";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { CriarEquipe } from "../../application/use-cases/CriarEquipe";
import { EquipeController } from "../controllers/EquipeController";
import { ObterEquipe } from "../../application/use-cases/ObterEquipe";
import { ObterTotaisPorEquipe } from "../../application/use-cases/ObterTotaisPorEquipe";
import { TotaisService } from "../../application/services/TotaisService";

const router = Router();
const equipeRepo = new EquipeRepositoryImpl();
const atividadeRepo = new AtividadeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl();
const criarEquipe = new CriarEquipe(equipeRepo);
const obterEquipe = new ObterEquipe(equipeRepo);

// Create an instance of TotaisService
const totaisService = new TotaisService(metaRepo, atividadeRepo);

// Pass the TotaisService instance to ObterTotaisPorEquipe
const obterTotaisPorEquipe = new ObterTotaisPorEquipe(totaisService);
const equipeController = new EquipeController(criarEquipe, obterEquipe, obterTotaisPorEquipe);

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

router.get("/equipes/:equipeId/totais", async (req, res) => {
    console.log("📨 Nova requisição GET /equipes/:equipeId/totais");
    return equipeController.obterTotais(req, res);
});

export default router;