import { Router } from "express";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { CriarAtividade } from "../../application/use-cases/CriarAtividade";
import { AtividadeController } from "../controllers/AtividadeController";

const router = Router();
const atividadeRepo = new AtividadeRepositoryImpl();
const criarAtividade = new CriarAtividade(atividadeRepo);
const atividadeController = new AtividadeController(criarAtividade);

router.post("/atividades", async (req, res) => {
    console.log("📨 Nova requisição POST /atividades");
    return atividadeController.criar(req, res);
});

export default router;