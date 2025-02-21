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
const router = (0, express_1.Router)();
const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
const criarAtividade = new CriarAtividade_1.CriarAtividade(atividadeRepo);
const obterAtividade = new ObterAtividades_1.ObterAtividades(atividadeRepo);
const atividadeController = new AtividadeController_1.AtividadeController(criarAtividade, obterAtividade);
router.post("/atividades", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📨 Nova requisição POST /atividades");
    return atividadeController.criar(req, res);
}));
router.get("/atividades/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📨 Nova requisição GET /atividades");
    const atividades = yield atividadeController.obterTodos(req, res);
    return res.json(atividades);
}));
router.get("/atividades/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📨 Nova requisição GET /atividades/:id");
    return atividadeController.obterPorId(req, res);
}));
router.get("/atividades/:id/detalhes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📨 Nova requisição GET /atividades/:id/detalhes");
    return atividadeController.obterDetalhes(req, res);
}));
exports.default = router;
