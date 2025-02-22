import { Router } from "express";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { CriarMeta } from "../../application/use-cases/CriarMeta";
import { MetaController } from "../controllers/MetaController";
import { ObterMeta } from "../../application/use-cases/ObterMeta";
import { AtualizarMeta } from "../../application/use-cases/AtualizarMeta";

const router = Router();
const metaRepo = new MetaRepositoryImpl();
const criarMeta = new CriarMeta(metaRepo);
const obterMeta = new ObterMeta(metaRepo);
const atualizarMeta = new AtualizarMeta(metaRepo);
const metaController = new MetaController(criarMeta, obterMeta, atualizarMeta);

router.post("/metas", async (req, res) => {
    console.log("📨 Nova requisição POST /metas");
    return metaController.criar(req, res);
});

router.get("/metas/all", async (req, res) => {
    console.log("📨 Nova requisição GET /metas");
    const metas = await metaController.obterTodos(req, res);
    return res.json(metas);
});

router.get("/metas/:id", async (req, res) => {
    console.log("📨 Nova requisição GET /metas/:id");
    return metaController.obterPorId(req, res);
});

router.get("/metas/equipe/:equipeId", async (req, res) => {
    console.log("📨 Nova requisição GET /metas/equipe/:equipeId");
    const equipeId = req.params.equipeId;
    return metaController.obterPorEquipe(req, res);
});

router.put("/metas/:id", async (req, res) => {
    console.log("📨 Nova requisição PUT /metas/:id");
    return metaController.atualizar(req, res);
});

export default router;