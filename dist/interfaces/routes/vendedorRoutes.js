"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const CriarVendedor_1 = require("../../application/use-cases/CriarVendedor");
const ObterVendedor_1 = require("../../application/use-cases/ObterVendedor");
const AtualizarVendedor_1 = require("../../application/use-cases/AtualizarVendedor");
const GetVendedorInsights_1 = require("../../application/use-cases/GetVendedorInsights");
const VendedorController_1 = require("../controllers/VendedorController");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const OllamaService_1 = require("../../application/services/OllamaService");
const AtividadeService_1 = require("../../application/services/AtividadeService");
const FrequenciaVendasService_1 = require("../../application/services/FrequenciaVendasService");
const ObterEquipeDadosFull_1 = require("../../application/use-cases/ObterEquipeDadosFull");
const router = (0, express_1.Router)();
// Repositories
const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
// Use Cases
const obterEquipeDadosFull = new ObterEquipeDadosFull_1.ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
// Services
const ollamaService = new OllamaService_1.OllamaService();
const atividadeService = new AtividadeService_1.AtividadeService(atividadeRepo, vendedorRepo, equipeRepo, metaRepo);
const frequenciaVendasService = new FrequenciaVendasService_1.FrequenciaVendasService(obterEquipeDadosFull);
// Use Cases
const criarVendedor = new CriarVendedor_1.CriarVendedor(vendedorRepo);
const obterVendedor = new ObterVendedor_1.ObterVendedor(vendedorRepo);
const atualizarVendedor = new AtualizarVendedor_1.AtualizarVendedor(vendedorRepo);
const getVendedorInsights = new GetVendedorInsights_1.GetVendedorInsights(vendedorRepo, equipeRepo, atividadeRepo, metaRepo, ollamaService, atividadeService, frequenciaVendasService);
// Controller
const vendedorController = new VendedorController_1.VendedorController(criarVendedor, obterVendedor, atualizarVendedor, getVendedorInsights);
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
exports.default = router;
//# sourceMappingURL=vendedorRoutes.js.map