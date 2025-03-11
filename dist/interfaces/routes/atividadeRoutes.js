"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const CriarAtividade_1 = require("../../application/use-cases/CriarAtividade");
const AtividadeController_1 = require("../controllers/AtividadeController");
const ObterAtividades_1 = require("../../application/use-cases/ObterAtividades");
const AtualizarAtividade_1 = require("../../application/use-cases/AtualizarAtividade");
const AtividadeService_1 = require("../../application/services/AtividadeService");
const ObterAtividadesPorVendedorEData_1 = require("../../application/use-cases/ObterAtividadesPorVendedorEData");
const FrequenciaVendasService_1 = require("../../application/services/FrequenciaVendasService");
const ObterEquipeDadosFull_1 = require("../../application/use-cases/ObterEquipeDadosFull");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const router = (0, express_1.Router)();
const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
const criarAtividade = new CriarAtividade_1.CriarAtividade(atividadeRepo);
const obterAtividade = new ObterAtividades_1.ObterAtividades(atividadeRepo);
const atualizarAtividade = new AtualizarAtividade_1.AtualizarAtividade(atividadeRepo);
const atividadeService = new AtividadeService_1.AtividadeService(atividadeRepo);
const obterAtividadesPorVendedorEData = new ObterAtividadesPorVendedorEData_1.ObterAtividadesPorVendedorEData(atividadeService);
const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
const obterEquipeDadosFull = new ObterEquipeDadosFull_1.ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
const frequenciaVendasService = new FrequenciaVendasService_1.FrequenciaVendasService(obterEquipeDadosFull);
const atividadeController = new AtividadeController_1.AtividadeController(criarAtividade, obterAtividade, atualizarAtividade, atividadeService, obterAtividadesPorVendedorEData, frequenciaVendasService);
router.post("/atividades", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição POST /atividades");
    return atividadeController.criar(req, res);
}));
router.get("/atividades/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição GET /atividades");
    const atividades = yield atividadeController.obterTodos(req, res);
    return res.json(atividades);
}));
router.get("/atividades/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição GET /atividades/:id");
    return atividadeController.obterPorId(req, res);
}));
router.get("/atividades/:id/detalhes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição GET /atividades/:id/detalhes");
    return atividadeController.obterDetalhes(req, res);
}));
router.put("/atividades/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição PUT /atividades/:id");
    return atividadeController.atualizar(req, res);
}));
router.get("/atividades/vendedor/:vendedorId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição GET /atividades/vendedor/:vendedorId");
    return atividadeController.getAtividadesByVendedorAndDate(req, res);
}));
router.get("/atividades/equipe/:equipeId/frequencia-vendas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição GET /atividades/equipe/:equipeId/frequencia-vendas");
    return atividadeController.calcularFrequenciaVendas(req, res);
}));
exports.default = router;
