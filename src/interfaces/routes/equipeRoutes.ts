import { Router } from "express";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { CriarEquipe } from "../../application/use-cases/CriarEquipe";
import { EquipeController } from "../controllers/EquipeController";

const router = Router();
const equipeRepo = new EquipeRepositoryImpl();
const criarEquipe = new CriarEquipe(equipeRepo);
const equipeController = new EquipeController(criarEquipe);

router.post("/equipes", (req, res) => equipeController.criar(req, res));

export default router;