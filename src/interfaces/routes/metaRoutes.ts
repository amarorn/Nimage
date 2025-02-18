import { Router } from "express";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { CriarMeta } from "../../application/use-cases/CriarMeta";
import { MetaController } from "../controllers/MetaController";
import { ObterMeta } from "../../application/use-cases/ObterMeta";

const router = Router();
const metaRepo = new MetaRepositoryImpl();
const criarMeta = new CriarMeta(metaRepo);
const obterMeta = new ObterMeta(metaRepo);
const metaController = new MetaController(criarMeta, obterMeta);

router.post("/metas", async (req, res) => {
    console.log("📨 Nova requisição POST /metas");
    return metaController.criar(req, res);
});

router.get("/metas/all", async (req, res) => {
    console.log("📨 Nova requisição GET /metas");
    const metas = await metaController.obterTodos(req, res);
    return res.json(metas);
});

export default router;