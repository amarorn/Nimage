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
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const AtividadeRepositoryImpl_1 = require("../../infrastructure/repositories/AtividadeRepositoryImpl");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const CriarEquipe_1 = require("../../application/use-cases/CriarEquipe");
const EquipeController_1 = require("../controllers/EquipeController");
const ObterEquipe_1 = require("../../application/use-cases/ObterEquipe");
const ObterEquipeDadosFull_1 = require("../../application/use-cases/ObterEquipeDadosFull");
const router = (0, express_1.Router)();
const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
const atividadeRepo = new AtividadeRepositoryImpl_1.AtividadeRepositoryImpl();
const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
const criarEquipe = new CriarEquipe_1.CriarEquipe(equipeRepo);
const obterEquipe = new ObterEquipe_1.ObterEquipe(equipeRepo);
const obterEquipeDadosFull = new ObterEquipeDadosFull_1.ObterEquipeDadosFull(equipeRepo, vendedorRepo, atividadeRepo, metaRepo);
const equipeController = new EquipeController_1.EquipeController(criarEquipe, obterEquipe, obterEquipeDadosFull);
router.post("/equipes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📨 Nova requisição POST /equipes");
    return equipeController.criar(req, res);
}));
router.get("/equipes/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📨 Nova requisição GET /equipes");
    const equipes = yield equipeController.obterTodos(req, res);
    return res.json(equipes);
}));
router.get("/equipes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📨 Nova requisição GET /equipes/:id");
    return equipeController.obterPorId(req, res);
}));
router.get("/equipes/:equipeId/dados-full", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📨 Nova requisição GET /equipes/:equipeId/dados-full");
    return equipeController.obterDadosFull(req, res);
}));
exports.default = router;
