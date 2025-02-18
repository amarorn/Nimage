import { Router } from "express";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { CriarAtividade } from "../../application/use-cases/CriarAtividade";
import { AtividadeController } from "../controllers/AtividadeController";
import { ObterAtividades } from "../../application/use-cases/ObterAtividades";

const router = Router();
const atividadeRepo = new AtividadeRepositoryImpl();
const criarAtividade = new CriarAtividade(atividadeRepo);
const obterAtividade  = new ObterAtividades(atividadeRepo);
const atividadeController = new AtividadeController(criarAtividade,obterAtividade);

router.post("/atividades", async (req, res) => {
    console.log("📨 Nova requisição POST /atividades");
    return atividadeController.criar(req, res);
});

router.get("/atividades/all", async (req, res) => {
    console.log("📨 Nova requisição GET /atividades");
    const atividades = await atividadeController.obterTodos(req, res);
    return res.json(atividades);
});

export default router;