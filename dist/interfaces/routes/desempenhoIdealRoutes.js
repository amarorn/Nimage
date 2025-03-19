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
const DesempenhoIdealService_1 = require("../../application/services/DesempenhoIdealService");
const DesempenhoIdealController_1 = require("../controllers/DesempenhoIdealController");
const router = (0, express_1.Router)();
const desempenhoIdealService = new DesempenhoIdealService_1.DesempenhoIdealService();
const desempenhoIdealController = new DesempenhoIdealController_1.DesempenhoIdealController(desempenhoIdealService);
router.get("/equipes/:equipeId/desempenho-ideal", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return desempenhoIdealController.calcularDesempenhoIdeal(req, res);
}));
exports.default = router;
//# sourceMappingURL=desempenhoIdealRoutes.js.map