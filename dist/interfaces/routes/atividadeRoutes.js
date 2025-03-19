"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const AtividadeService_1 = require("../../application/services/AtividadeService");
const ObterAtividades_1 = require("../../application/use-cases/ObterAtividades");
const AtualizarAtividade_1 = require("../../application/use-cases/AtualizarAtividade");
const ObterAtividadesPorVendedorEData_1 = require("../../application/use-cases/ObterAtividadesPorVendedorEData");
const AtividadeController_1 = require("../controllers/AtividadeController");
const CriarAtividade_1 = require("../../application/use-cases/CriarAtividade");
const FrequenciaVendasService_1 = require("../../application/services/FrequenciaVendasService");
const ObterEquipeDadosFull_1 = require("../../application/use-cases/ObterEquipeDadosFull");
const router = express_1.default.Router();
// Repositories
const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
// Use Cases
const criarAtividade = new CriarAtividade_1.CriarAtividade(atividadeRepo);
const obterAtividade = new ObterAtividades_1.ObterAtividades(atividadeRepo);
const atualizarAtividade = new AtualizarAtividade_1.AtualizarAtividade(atividadeRepo);
const obterEquipeDadosFull = new ObterEquipeDadosFull_1.ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
// Services
const atividadeService = new AtividadeService_1.AtividadeService(atividadeRepo, vendedorRepo, equipeRepo, metaRepo);
const frequenciaVendasService = new FrequenciaVendasService_1.FrequenciaVendasService(obterEquipeDadosFull);
const obterAtividadesPorVendedorEData = new ObterAtividadesPorVendedorEData_1.ObterAtividadesPorVendedorEData(atividadeService);
// Controller
const atividadeController = new AtividadeController_1.AtividadeController(criarAtividade, obterAtividade, atualizarAtividade, atividadeService, obterAtividadesPorVendedorEData, frequenciaVendasService);
// Routes
router.post("/atividades", atividadeController.criar);
router.get("/atividades/all", atividadeController.obterTodos);
router.get("/atividades/:id", atividadeController.obterPorId);
router.get("/atividades/:id/detalhes", atividadeController.obterDetalhes);
router.put("/atividades/:id", atividadeController.atualizar);
router.get("/atividades/vendedor/:vendedorId", atividadeController.getAtividadesByVendedorAndDate);
router.get("/atividades/equipe/:equipeId/frequencia-vendas", atividadeController.calcularFrequenciaVendas);
exports.default = router;
//# sourceMappingURL=atividadeRoutes.js.map