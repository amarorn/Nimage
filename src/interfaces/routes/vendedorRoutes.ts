import { Router } from "express";
import { VendedorRepositoryImpl } from "../../infrastructure/repositories/VendedorRepositoryImpl";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { AtividadeRepositoryImpl } from "../../infrastructure/repositories/AtividadeRepositoryImpl";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { CriarVendedor } from "../../application/use-cases/CriarVendedor";
import { VendedorController } from "../controllers/VendedorController";
import { ObterVendedor } from "../../application/use-cases/ObterVendedor";
import { AtualizarVendedor } from "../../application/use-cases/AtualizarVendedor";
import { GetVendedorInsights } from "../../application/use-cases/GetVendedorInsights";
import { AtividadeService } from "../../application/services/AtividadeService";
import { FrequenciaVendasService } from "../../application/services/FrequenciaVendasService";
import { ObterEquipeDadosFull } from "../../application/use-cases/ObterEquipeDadosFull";
import { OllamaService } from "../../application/services/OllamaService";

const router = Router();

// Repositories
const vendedorRepo = new VendedorRepositoryImpl();
const equipeRepo = new EquipeRepositoryImpl();
const atividadeRepo = new AtividadeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl();

// Services
const atividadeService = new AtividadeService(atividadeRepo, vendedorRepo, equipeRepo, metaRepo);
const ollamaService = new OllamaService();
const obterEquipeDadosFull = new ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
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

// Routes
router.post("/vendedores", async (req, res) => {
    return vendedorController.criar(req, res);
});

router.get("/vendedores", async (req, res) => {
    try {
        const resultado = await vendedorController.obterTodos(req, res);
        return resultado;
    } catch (erro) {
        return res.status(500).json({
            erro: 'Erro interno ao obter vendedores',
            mensagem: (erro as Error).message
        });
    }
});

router.get("/vendedores/all", async (req, res) => {
    try {
        const resultado = await vendedorController.obterTodos(req, res);
        return resultado;
    } catch (erro) {
        return res.status(500).json({
            erro: 'Erro interno ao obter vendedores',
            mensagem: (erro as Error).message
        });
    }
});

router.get("/vendedores/:id", async (req, res) => {
    return vendedorController.obterPorId(req, res);
});

router.put("/vendedores/:id", async (req, res) => {
    return vendedorController.atualizar(req, res);
});

router.get("/vendedores/:id/insights", async (req, res) => {
    return vendedorController.obterInsights(req, res);
});

export default router;