import { Router } from "express";
import { TemaRepositoryImpl } from "../../infrastructure/repositories/TemaRepositoryImpl";
import { CriarTema } from "../../application/use-cases/CriarTema";
import { ObterTema } from "../../application/use-cases/ObterTema";
import { AtualizarTema } from "../../application/use-cases/AtualizarTema";
import { TemaController } from "../controllers/TemaController";

const router = Router();

// Instanciando o repositório e casos de uso
const temaRepo = new TemaRepositoryImpl();
const criarTema = new CriarTema(temaRepo);
const obterTema = new ObterTema(temaRepo);
const atualizarTema = new AtualizarTema(temaRepo);

// Instanciando o controller
const temaController = new TemaController(criarTema, obterTema, atualizarTema, temaRepo);

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

export default router; 