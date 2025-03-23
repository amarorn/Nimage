import { Router } from "express";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { CriarVendedor } from "../../application/use-cases/CriarVendedor";
import { ObterVendedor } from "../../application/use-cases/ObterVendedor";
import { AtualizarVendedor } from "../../application/use-cases/AtualizarVendedor";
import { GetVendedorInsights } from "../../application/use-cases/GetVendedorInsights";
import { VendedorController } from "../controllers/VendedorController";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { OllamaService } from "../../application/services/OllamaService";
import { AtividadeService } from "../../application/services/AtividadeService";
import { FrequenciaVendasService } from "../../application/services/FrequenciaVendasService";
import { ObterEquipeDadosFull } from "../../application/use-cases/ObterEquipeDadosFull";

const router = Router();

// Repositories
const vendedorRepo = new VendedorRepositoryImpl();
const equipeRepo = new EquipeRepositoryImpl();
const atividadeRepo = new AtividadeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl();

// Use Cases
const obterEquipeDadosFull = new ObterEquipeDadosFull(
    equipeRepo,
    vendedorRepo,
    atividadeRepo,
    metaRepo
);

// Services
const ollamaService = new OllamaService();
const atividadeService = new AtividadeService(
    atividadeRepo,
    vendedorRepo,
    equipeRepo,
    metaRepo
);
const frequenciaVendasService = new FrequenciaVendasService(obterEquipeDadosFull);

// Use Cases
const criarVendedor = new CriarVendedor(vendedorRepo);
const obterVendedor = new ObterVendedor(vendedorRepo);
const atualizarVendedor = new AtualizarVendedor(vendedorRepo);
const getVendedorInsights = new GetVendedorInsights(
    vendedorRepo,
    equipeRepo,
    atividadeRepo,
    metaRepo,
    ollamaService,
    atividadeService,
    frequenciaVendasService
);

// Controller
const vendedorController = new VendedorController(
    criarVendedor,
    obterVendedor,
    atualizarVendedor,
    getVendedorInsights
);

//console.log("🚀vendedorController Routes");
router.post("/vendedores", async (req, res) => {
    //console.log("📨 Nova requisição POST /vendedores");
    return vendedorController.criar(req, res);
});

router.get("/vendedores/all", async (req, res) => {
    //console.log("📨 Nova requisição GET /vendedores");
    const vendedores = await vendedorController.obterTodos(req, res);
    return res.json(vendedores);
});

router.get("/vendedores/:id", async (req, res) => {
    //console.log("📨 Nova requisição GET /vendedores/:id");
    return vendedorController.obterPorId(req, res);
});

router.put("/vendedores/:id", async (req, res) => {
    //console.log("📨 Nova requisição PUT /vendedores/:id");
    return vendedorController.atualizar(req, res);
});

router.get("/vendedores/:id/insights", async (req, res) => {
    return vendedorController.obterInsights(req, res);
});

export default router;