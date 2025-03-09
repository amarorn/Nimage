import { Router } from "express";
import { DesempenhoIdealService } from "../../application/services/DesempenhoIdealService";
import { DesempenhoIdealController } from "../controllers/DesempenhoIdealController";

const router = Router();
const desempenhoIdealService = new DesempenhoIdealService();
const desempenhoIdealController = new DesempenhoIdealController(desempenhoIdealService);

router.get("/equipes/:equipeId/desempenho-ideal", async (req, res) => {
    return desempenhoIdealController.calcularDesempenhoIdeal(req, res);
});

export default router;