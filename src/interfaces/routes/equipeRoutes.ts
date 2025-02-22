import { Router } from "express";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { CriarEquipe } from "../../application/use-cases/CriarEquipe";
import { EquipeController } from "../controllers/EquipeController";
import { ObterEquipe } from "../../application/use-cases/ObterEquipe";
import { ObterEquipeDadosFull } from "../../application/use-cases/ObterEquipeDadosFull";
import { EquipeMetaService } from "../../application/services/EquipeMetaService";
import { AtualizarEquipe } from "../../application/use-cases/AtualizarEquipe";

const router = Router();
const equipeRepo = new EquipeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl();
const atividadeRepo = new AtividadeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl();

const criarEquipe = new CriarEquipe(equipeRepo);
const obterEquipe = new ObterEquipe(equipeRepo);
const atualizar = new AtualizarEquipe(equipeRepo);
const obterEquipeDadosFull = new ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
const equipeMetaService = new EquipeMetaService(obterEquipeDadosFull);
const equipeController = new EquipeController(criarEquipe, obterEquipe, obterEquipeDadosFull, equipeMetaService, atualizar);

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

// Nova rota para calcular a meta
router.get("/equipes/:equipeId/calcular-meta", async (req, res) => {
    console.log("📨 Nova requisição GET /equipes/:equipeId/calcular-meta");
    return equipeController.calcularMeta(req, res);
});

router.put("/equipes/:id", async (req, res) => {
    console.log("📨 Nova requisição PUT /equipes/:id");
    return equipeController.atualizar(req, res);
});

export default router;