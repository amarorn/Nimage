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
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const CriarMeta_1 = require("../../application/use-cases/CriarMeta");
const MetaController_1 = require("../controllers/MetaController");
const ObterMeta_1 = require("../../application/use-cases/ObterMeta");
const AtualizarMeta_1 = require("../../application/use-cases/AtualizarMeta");
const router = (0, express_1.Router)();
const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
const criarMeta = new CriarMeta_1.CriarMeta(metaRepo);
const obterMeta = new ObterMeta_1.ObterMeta(metaRepo);
const atualizarMeta = new AtualizarMeta_1.AtualizarMeta(metaRepo);
const metaController = new MetaController_1.MetaController(criarMeta, obterMeta, atualizarMeta);
router.post("/metas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição POST /metas");
    return metaController.criar(req, res);
}));
router.get("/metas/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição GET /metas");
    const metas = yield metaController.obterTodos(req, res);
    return res.json(metas);
}));
router.get("/metas/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição GET /metas/:id");
    return metaController.obterPorId(req, res);
}));
router.get("/metas/equipe/:equipeId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição GET /metas/equipe/:equipeId");
    const equipeId = req.params.equipeId;
    return metaController.obterPorEquipe(req, res);
}));
router.put("/metas/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição PUT /metas/:id");
    return metaController.atualizar(req, res);
}));
exports.default = router;
