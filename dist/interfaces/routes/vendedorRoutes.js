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
const VendedorRepositoryImpl_1 = require("../../infrastructure/repositories/VendedorRepositoryImpl");
const CriarVendedor_1 = require("../../application/use-cases/CriarVendedor");
const ObterVendedor_1 = require("../../application/use-cases/ObterVendedor");
const AtualizarVendedor_1 = require("../../application/use-cases/AtualizarVendedor");
const VendedorController_1 = require("../controllers/VendedorController");
const router = (0, express_1.Router)();
const vendedorRepo = new VendedorRepositoryImpl_1.VendedorRepositoryImpl();
const criarVendedor = new CriarVendedor_1.CriarVendedor(vendedorRepo);
const obterVendedor = new ObterVendedor_1.ObterVendedor(vendedorRepo);
const atualizarVendedor = new AtualizarVendedor_1.AtualizarVendedor(vendedorRepo);
const vendedorController = new VendedorController_1.VendedorController(criarVendedor, obterVendedor, atualizarVendedor);
//console.log("🚀vendedorController Routes");
router.post("/vendedores", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição POST /vendedores");
    return vendedorController.criar(req, res);
}));
router.get("/vendedores/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição GET /vendedores");
    const vendedores = yield vendedorController.obterTodos(req, res);
    return res.json(vendedores);
}));
router.get("/vendedores/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição GET /vendedores/:id");
    return vendedorController.obterPorId(req, res);
}));
router.put("/vendedores/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("📨 Nova requisição PUT /vendedores/:id");
    return vendedorController.atualizar(req, res);
}));
exports.default = router;
