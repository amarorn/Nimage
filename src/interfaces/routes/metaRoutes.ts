import { Router } from "express";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { CriarMeta } from "../../application/use-cases/CriarMeta";
import { MetaController } from "../controllers/MetaController";

const router = Router();
const metaRepo = new MetaRepositoryImpl();
const criarMeta = new CriarMeta(metaRepo);
const metaController = new MetaController(criarMeta);

router.post("/metas", async (req, res) => {
    console.log("📨 Nova requisição POST /metas");
    return metaController.criar(req, res);
});

export default router;