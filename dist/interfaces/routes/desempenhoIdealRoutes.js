"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DesempenhoIdealService_1 = require("../../application/services/DesempenhoIdealService");
const DesempenhoIdealController_1 = require("../controllers/DesempenhoIdealController");
const router = (0, express_1.Router)();
const desempenhoIdealService = new DesempenhoIdealService_1.DesempenhoIdealService();
const desempenhoIdealController = new DesempenhoIdealController_1.DesempenhoIdealController(desempenhoIdealService);
router.get("/equipes/:equipeId/desempenho-ideal", async (req, res) => {
    return desempenhoIdealController.calcularDesempenhoIdeal(req, res);
});
exports.default = router;
//# sourceMappingURL=desempenhoIdealRoutes.js.map