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
const CriarEquipe_1 = require("../../application/use-cases/CriarEquipe");
const EquipeController_1 = require("../controllers/EquipeController");
const router = (0, express_1.Router)();
const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
const criarEquipe = new CriarEquipe_1.CriarEquipe(equipeRepo);
const equipeController = new EquipeController_1.EquipeController(criarEquipe);
router.post("/equipes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📨 Nova requisição POST /equipes");
    return equipeController.criar(req, res);
}));
exports.default = router;
