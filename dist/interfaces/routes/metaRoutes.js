"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MetaRepositoryImpl_1 = require("../../infrastructure/repositories/MetaRepositoryImpl");
const CriarMeta_1 = require("../../application/use-cases/CriarMeta");
const MetaController_1 = require("../controllers/MetaController");
const ObterMeta_1 = require("../../application/use-cases/ObterMeta");
const AtualizarMeta_1 = require("../../application/use-cases/AtualizarMeta");
const EquipeRepositoryImpl_1 = require("../../infrastructure/repositories/EquipeRepositoryImpl");
const ObterEquipePorId_1 = require("../../application/use-cases/ObterEquipePorId");
const router = (0, express_1.Router)();
const metaRepo = new MetaRepositoryImpl_1.MetaRepositoryImpl();
const criarMeta = new CriarMeta_1.CriarMeta(metaRepo);
const obterMeta = new ObterMeta_1.ObterMeta(metaRepo);
const atualizarMeta = new AtualizarMeta_1.AtualizarMeta(metaRepo);
const equipeRepo = new EquipeRepositoryImpl_1.EquipeRepositoryImpl();
const obterEquipePorId = new ObterEquipePorId_1.ObterEquipePorId(equipeRepo);
const metaController = new MetaController_1.MetaController(criarMeta, obterMeta, atualizarMeta, obterEquipePorId);
router.post("/metas", async (req, res) => {
    return metaController.criar(req, res);
});
router.get("/metas", async (req, res) => {
    try {
        // Validação dos parâmetros de paginação
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        if (page < 1 || limit < 1) {
            return res.status(400).json({
                erro: 'Parâmetros de paginação inválidos',
                detalhes: {
                    page: page < 1 ? 'A página deve ser maior que 0' : 'válido',
                    limit: limit < 1 ? 'O limite deve ser maior que 0' : 'válido'
                }
            });
        }
        const resultado = await metaController.obterTodos(req, res);
        return res.status(200).json(resultado);
    }
    catch (erro) {
        console.error('Erro ao obter metas:', erro);
        return res.status(500).json({
            erro: 'Erro interno ao obter metas',
            mensagem: erro.message
        });
    }
});
router.get("/metas/all", async (req, res) => {
    try {
        const resultado = await metaController.obterTodos(req, res);
        return res.status(200).json(resultado);
    }
    catch (erro) {
        console.error('Erro ao obter metas:', erro);
        return res.status(500).json({
            erro: 'Erro interno ao obter metas',
            mensagem: erro.message
        });
    }
});
router.get("/metas/:id", async (req, res) => {
    return metaController.obterPorId(req, res);
});
router.get("/metas/equipe/:equipeId", async (req, res) => {
    return metaController.obterPorEquipe(req, res);
});
router.put("/metas/:id", async (req, res) => {
    return metaController.atualizar(req, res);
});
exports.default = router;
//# sourceMappingURL=metaRoutes.js.map