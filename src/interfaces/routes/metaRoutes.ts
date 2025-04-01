import { Router } from "express";
import { MetaRepositoryImpl } from "../../infrastructure/repositories/MetaRepositoryImpl";
import { CriarMeta } from "../../application/use-cases/CriarMeta";
import { MetaController } from "../controllers/MetaController";
import { ObterMeta } from "../../application/use-cases/ObterMeta";
import { AtualizarMeta } from "../../application/use-cases/AtualizarMeta";
import { EquipeRepositoryImpl } from "../../infrastructure/repositories/EquipeRepositoryImpl";
import { ObterEquipePorId } from "../../application/use-cases/ObterEquipePorId";

const router = Router();
const metaRepo = new MetaRepositoryImpl();
const criarMeta = new CriarMeta(metaRepo);
const obterMeta = new ObterMeta(metaRepo);
const atualizarMeta = new AtualizarMeta(metaRepo);
const equipeRepo = new EquipeRepositoryImpl();
const obterEquipePorId = new ObterEquipePorId(equipeRepo);
const metaController = new MetaController(criarMeta, obterMeta, atualizarMeta, obterEquipePorId);

router.post("/metas", async (req, res) => {
    return metaController.criar(req, res);
});

router.get("/metas", async (req, res) => {
    try {
        // Validação dos parâmetros de paginação
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

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
    } catch (erro) {
        console.error('Erro ao obter metas:', erro);
        return res.status(500).json({
            erro: 'Erro interno ao obter metas',
            mensagem: (erro as Error).message
        });
    }
});

router.get("/metas/all", async (req, res) => {
    try {
        const resultado = await metaController.obterTodos(req, res);
        return res.status(200).json(resultado);
    } catch (erro) {
        console.error('Erro ao obter metas:', erro);
        return res.status(500).json({
            erro: 'Erro interno ao obter metas',
            mensagem: (erro as Error).message
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

export default router;