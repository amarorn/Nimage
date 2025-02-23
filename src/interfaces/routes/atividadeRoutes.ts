import { Router } from "express";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { CriarAtividade } from "../../application/use-cases/CriarAtividade";
import { AtividadeController } from "../controllers/AtividadeController";
import { ObterAtividades } from "../../application/use-cases/ObterAtividades";
import { AtualizarAtividade } from "../../application/use-cases/AtualizarAtividade";

const router = Router();
const atividadeRepo = new AtividadeRepositoryImpl();
const criarAtividade = new CriarAtividade(atividadeRepo);
const obterAtividade  = new ObterAtividades(atividadeRepo);
const atualizarAtividade = new AtualizarAtividade(atividadeRepo);
const atividadeController = new AtividadeController(criarAtividade, obterAtividade, atualizarAtividade);

router.post("/atividades", async (req, res) => {
    //console.log("📨 Nova requisição POST /atividades");
    return atividadeController.criar(req, res);
});

router.get("/atividades/all", async (req, res) => {
    //console.log("📨 Nova requisição GET /atividades");
    const atividades = await atividadeController.obterTodos(req, res);
    return res.json(atividades);
});

router.get("/atividades/:id", async (req, res) => {
    //console.log("📨 Nova requisição GET /atividades/:id");
    return atividadeController.obterPorId(req, res);
});

router.get("/atividades/:id/detalhes", async (req, res) => {
    //console.log("📨 Nova requisição GET /atividades/:id/detalhes");
    return atividadeController.obterDetalhes(req, res);
});

router.put("/atividades/:id", async (req, res) => {
    //console.log("📨 Nova requisição PUT /atividades/:id");
    return atividadeController.atualizar(req, res);
});

export default router;