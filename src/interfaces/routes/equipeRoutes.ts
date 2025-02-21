import { Router } from "express";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { CriarEquipe } from "../../application/use-cases/CriarEquipe";
import { EquipeController } from "../controllers/EquipeController";
import { ObterEquipe } from "../../application/use-cases/ObterEquipe";
import { ObterEquipeDadosFull } from "../../application/use-cases/ObterEquipeDadosFull";

const router = Router();
const equipeRepo = new EquipeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl();
const atividadeRepo = new AtividadeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl();

const criarEquipe = new CriarEquipe(equipeRepo);
const obterEquipe = new ObterEquipe(equipeRepo);
const obterEquipeDadosFull = new ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
const equipeController = new EquipeController(criarEquipe, obterEquipe, obterEquipeDadosFull);

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

router.get("/equipes/:equipeId/dados-full", async (req, res) => {
    console.log("📨 Nova requisição GET /equipes/:equipeId/dados-full");
    return equipeController.obterDadosFull(req, res);
});

export default router;