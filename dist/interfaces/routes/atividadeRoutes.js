"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const CriarAtividade_1 = require("../../application/use-cases/CriarAtividade");
const AtividadeController_1 = require("../controllers/AtividadeController");
const ObterAtividades_1 = require("../../application/use-cases/ObterAtividades");
const AtualizarAtividade_1 = require("../../application/use-cases/AtualizarAtividade");
const ObterAtividadesPorVendedorEData_1 = require("../../application/use-cases/ObterAtividadesPorVendedorEData");
const AtividadeService_1 = require("../../application/services/AtividadeService");
const FrequenciaVendasService_1 = require("../../application/services/FrequenciaVendasService");
const ObterEquipeDadosFull_1 = require("../../application/use-cases/ObterEquipeDadosFull");
const router = (0, express_1.Router)();
// Repositories
const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
// Services
const atividadeService = new AtividadeService_1.AtividadeService(atividadeRepo, vendedorRepo, equipeRepo, metaRepo);
// Use Cases
const criarAtividade = new CriarAtividade_1.CriarAtividade(atividadeRepo);
const obterAtividades = new ObterAtividades_1.ObterAtividades(atividadeRepo);
const atualizarAtividade = new AtualizarAtividade_1.AtualizarAtividade(atividadeRepo);
const obterAtividadesPorVendedorEData = new ObterAtividadesPorVendedorEData_1.ObterAtividadesPorVendedorEData(atividadeService);
const obterEquipeDadosFull = new ObterEquipeDadosFull_1.ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
const frequenciaVendasService = new FrequenciaVendasService_1.FrequenciaVendasService(obterEquipeDadosFull);
// Controller
const atividadeController = new AtividadeController_1.AtividadeController(criarAtividade, obterAtividades, atualizarAtividade, atividadeService, obterAtividadesPorVendedorEData, frequenciaVendasService);
// Routes
router.post("/atividades", async (req, res) => {
    return atividadeController.criar(req, res);
});
// Rota para obter todas as atividades (mantida para compatibilidade)
router.get("/atividades", async (req, res) => {
    return atividadeController.obterTodos(req, res);
});
// Nova rota /all que retorna todas as atividades sem paginação
router.get("/atividades/all", async (req, res) => {
    return atividadeController.obterTodosCompleto(req, res);
});
router.get("/atividades/:id", async (req, res) => {
    return atividadeController.obterPorId(req, res);
});
router.put("/atividades/:id", async (req, res) => {
    return atividadeController.atualizar(req, res);
});
router.get("/atividades/vendedor/:vendedorId", async (req, res) => {
    return atividadeController.getAtividadesByVendedorAndDate(req, res);
});
router.get("/atividades/equipe/:equipeId", async (req, res) => {
    return atividadeController.getAtividadesByVendedorAndDate(req, res);
});
router.get("/atividades/vendedor/:vendedorId/data", async (req, res) => {
    return atividadeController.getAtividadesByVendedorAndDate(req, res);
});
router.get("/atividades/equipe/:equipeId/frequencia-vendas", async (req, res) => {
    return atividadeController.calcularFrequenciaVendas(req, res);
});
exports.default = router;
//# sourceMappingURL=atividadeRoutes.js.map